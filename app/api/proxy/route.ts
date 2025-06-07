import { NextRequest, NextResponse } from 'next/server';

// Configuration constants
const PROXY_VERSION = '1.1.0';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RESPONSE_SIZE = 50 * 1024 * 1024; // 50MB
const BLOCKED_DOMAINS: string[] = []; // Add domains you want to block

// Headers that should be removed for security/compatibility
const EXCLUDED_REQUEST_HEADERS = [
  'host', 'origin', 'referer', 'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest',
  'connection', 'cookie', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { 
      url, 
      method = 'GET', 
      headers = {}, 
      data,
      timeout = DEFAULT_TIMEOUT,
      followRedirects = true,
      responseType = 'auto' // 'auto', 'json', 'text', 'binary'
    } = body;

    // Request validation
    if (!url) {
      return createErrorResponse('URL is required', 400);
    }

    // URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return createErrorResponse('Invalid URL format', 400);
    }

    // Domain blocking check
    if (BLOCKED_DOMAINS.includes(parsedUrl.hostname)) {
      return createErrorResponse('This domain is not allowed', 403);
    }

    // Process request headers
    const cleanHeaders: Record<string, string> = processRequestHeaders(headers);

    // Prepare the request options
    const requestOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: cleanHeaders,
      redirect: followRedirects ? 'follow' : 'manual',
      signal: AbortSignal.timeout(timeout)
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && data !== undefined) {
      requestOptions.body = prepareRequestBody(data, cleanHeaders);
    }

    console.log(`🚀 Proxying ${method.toUpperCase()} request to: ${url}`);

    // Make the actual request
    const response = await fetch(url, requestOptions);
    
    // Process response
    const processedResponse = await processResponse(response, responseType);

    return NextResponse.json(processedResponse, {
      headers: getCorsHeaders()
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    
    // Handle timeout errors specifically
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return createErrorResponse('Request timeout', 504);
    }
    
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

function processRequestHeaders(headers: Record<string, string>): Record<string, string> {
  const cleanHeaders: Record<string, string> = {};
  
  // Process incoming headers
  Object.entries(headers).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (!EXCLUDED_REQUEST_HEADERS.includes(lowerKey)) {
      cleanHeaders[key] = value as string;
    }
  });

  // Add default headers
  cleanHeaders['User-Agent'] = cleanHeaders['User-Agent'] || 'APIONIX-Proxy/1.1';
  
  return cleanHeaders;
}

function prepareRequestBody(data: any, headers: Record<string, string>): string {
  if (data === null || data === undefined) {
    return '';
  }

  if (typeof data === 'string') {
    return data;
  }
  
  // Handle FormData or URLSearchParams if needed here
  
  // Default to JSON
  if (!headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  return JSON.stringify(data);
}

async function processResponse(response: Response, responseType: string): Promise<any> {
  // Get response headers
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  // Handle response based on content type or requested response type
  const contentType = response.headers.get('content-type') || '';
  let responseData;

  try {
    if (responseType === 'json' || (responseType === 'auto' && contentType.includes('application/json'))) {
      responseData = await response.json();
    } 
    else if (responseType === 'text' || (responseType === 'auto' && 
        (contentType.includes('text/') || contentType.includes('application/xml') || 
         contentType.includes('application/javascript')))) {
      responseData = await response.text();
    } 
    else if (responseType === 'binary' || responseType === 'auto') {
      // For binary data or unknown content types
      const arrayBuffer = await response.arrayBuffer();
      const isTextual = contentType.includes('text/') || 
                        contentType.includes('application/json') || 
                        contentType.includes('application/xml') ||
                        contentType.includes('application/javascript');
      
      if (isTextual && responseType === 'auto') {
        // Try to convert to text if it seems like text
        responseData = new TextDecoder().decode(arrayBuffer);
      } else {
        responseData = {
          type: 'binary',
          size: arrayBuffer.byteLength,
          contentType: contentType,
          data: Buffer.from(arrayBuffer).toString('base64')
        };
      }
    }
  } catch (error) {
    // If parsing fails, try to get as text
    try {
      responseData = await response.text();
    } catch {
      responseData = { error: 'Failed to parse response' };
    }
  }

  return {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    url: response.url,
    ok: response.ok,
    redirected: response.redirected,
    type: response.type
  };
}

function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400' // 24 hours
  };
}

function createErrorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    {
      error: status >= 500 ? 'Proxy request failed' : 'Invalid request',
      message,
      details: status >= 500 
        ? 'The proxy server encountered an error while processing your request.'
        : 'Please check your request parameters and try again.',
      timestamp: new Date().toISOString()
    },
    { 
      status,
      headers: getCorsHeaders()
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'APIONIX Proxy Server',
    version: PROXY_VERSION,
    status: 'active',
    methods: ['POST', 'OPTIONS', 'GET'],
    description: 'Send POST request with { url, method, headers, data, timeout, followRedirects, responseType } to proxy API calls',
    endpoints: {
      proxy: '/api/proxy',
      health: '/api/proxy (GET)'
    },
    documentation: {
      requestFormat: {
        url: 'Target URL (required)',
        method: 'HTTP method (default: GET)',
        headers: 'Request headers object (optional)',
        data: 'Request body (optional)',
        timeout: `Request timeout in ms (default: ${DEFAULT_TIMEOUT})`,
        followRedirects: 'Whether to follow redirects (default: true)',
        responseType: 'Response type: auto, json, text, or binary (default: auto)'
      }
    }
  });
}