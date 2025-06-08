                    <div className="">
  <div
    className={`
        overflow-hidden rounded-md -mt-1
        transition-all duration-300 ease-in-out
        ${isResponseBodyExpanded ? "max-h-96" : "max-h-28"}
      `}
  >
    <div className="bg-black/10 flex gap-1 justify-start items-center text-white/50 text-xs px-2 py-1">
      <button
        onClick={handleResponseBodyExpand}
        className={`
            bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-600/20 p-1 
            flex justify-center items-center text-white rounded-md
            transition-transform duration-300 ease-in-out
            ${isResponseBodyExpanded ? "rotate-90" : "rotate-0"}
          `}
      >
        <ChevronsRight size={14} />
      </button>
      <h3 className="text-[#73DC8C] text-xs font-medium">
        Response Body
      </h3>
      {apiResponse && (
        <span className="text-white/40 text-[10px] ml-auto">
          {typeof apiResponse === "object"
            ? "JSON"
            : "TEXT"}
        </span>
      )}
    </div>

    {apiResponse ? (
      <div
        className="w-full h-80 bg-black/20 backdrop-blur-md p-3 rounded-md overflow-auto text-white/80 text-xs scrollbar-hide webkit-scrollbar-hide"
        style={{
          fontFamily:
            "PolySansMono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          .webkit-scrollbar-hide {
            -webkit-overflow-scrolling: touch;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar-track {
            display: none;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar-thumb {
            display: none;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar-corner {
            display: none;
          }
        `}</style>
        <pre
          className="whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{
            __html: formatJsonResponse(apiResponse),
          }}
        />
      </div>
    ) : (
      <div
        className="w-full h-80 bg-black/20 backdrop-blur-md p-3 rounded-md overflow-auto text-white/80 text-xs flex items-center justify-center scrollbar-hide webkit-scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          .webkit-scrollbar-hide {
            -webkit-overflow-scrolling: touch;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar-track {
            display: none;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar-thumb {
            display: none;
          }
          .webkit-scrollbar-hide::-webkit-scrollbar-corner {
            display: none;
          }
        `}</style>
        <div className="text-white/40 text-center">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoaderCircle
                className="animate-spin"
                size={16}
              />
              <span>Sending request...</span>
            </div>
          ) : (
            <span>
              No response data available. Send a request to
              see the response.
            </span>
          )}
        </div>
      </div>
    )}
  </div>
</div>