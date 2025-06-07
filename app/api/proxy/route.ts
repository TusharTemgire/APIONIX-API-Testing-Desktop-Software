import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, method = 'GET', headers = {}, data } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Clean up headers to avoid conflicts
    const cleanHeaders: Record<string, string> = {};
    Object.entries(headers).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      // Skip problematic headers
      if (!['host', 'origin', 'referer', 'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest'].includes(lowerKey)) {
        cleanHeaders[key] = value as string;
      }
    });

    // Add default headers
    cleanHeaders['User-Agent'] = 'APIONIX-Proxy/1.0';
    
    // Prepare the request options
    const requestOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: cleanHeaders,
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && data) {
      if (typeof data === 'string') {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
        if (!cleanHeaders['Content-Type'] && !cleanHeaders['content-type']) {
          cleanHeaders['Content-Type'] = 'application/json';
        }
      }
    }

    console.log('🚀 Proxying request to:', url);
    console.log('📝 Method:', method);
    console.log('📋 Headers:', cleanHeaders);

    // Make the actual request
    const response = await fetch(url, requestOptions);
    
    // Get response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Get response data
    const contentType = response.headers.get('content-type') || '';
    let responseData;

    try {
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType.includes('text/') || contentType.includes('application/xml')) {
        responseData = await response.text();
      } else {
        // For binary data
        const arrayBuffer = await response.arrayBuffer();
        responseData = {
          type: 'binary',
          size: arrayBuffer.byteLength,
          contentType: contentType,
          data: Buffer.from(arrayBuffer).toString('base64')
        };
      }
    } catch (error) {
      // If parsing fails, try to get as text
      try {
        responseData = await response.text();
      } catch {
        responseData = { error: 'Failed to parse response' };
      }
    }

    console.log('✅ Response received:', response.status, response.statusText);

    // Return the proxied response with metadata
    return NextResponse.json({
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      url: response.url,
      ok: response.ok,
      redirected: response.redirected,
      type: response.type
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      }
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    
    return NextResponse.json(
      {
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: 'The proxy server encountered an error while processing your request.',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'APIONIX Proxy Server',
    version: '1.0.0',
    status: 'active',
    methods: ['POST'],
    description: 'Send POST request with { url, method, headers, data } to proxy API calls',
    endpoints: {
      proxy: '/api/proxy',
      health: '/api/proxy (GET)'
    }
  });
}