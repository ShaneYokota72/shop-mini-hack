"use client";
import Image from "next/image";
import { useState } from "react";

function VotingComponent() {
  const [canvasA, setCanvasA] = useState<any>(null);
  const [canvasB, setCanvasB] = useState<any>(null);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteResult, setVoteResult] = useState<any>(null);

  const fetchTwoCanvases = async () => {
    setLoading(true);
    setError(null);
    setVoteResult(null);
    setCanvasA(null);
    setCanvasB(null);
    
    try {
      let url = "/api/getTwoLeastRecentlyUsed";
      if (excludedIds.length > 0) {
        url += `?excludeIds=${excludedIds.join(',')}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch canvases for voting");
      }
      const response = await res.json();
      const data = response.data || response; // Handle both {data: []} and [] response formats
      const itemsArray = Array.isArray(data) ? data : []; // Ensure it's always an array
      
      if (itemsArray.length < 2) {
        setError("Need at least 2 canvas items to start voting (may have exhausted unique pairs)");
        return;
      }
      
      setCanvasA(itemsArray[0]);
      setCanvasB(itemsArray[1]);
      
      // Add the new IDs to the excluded list
      const newIds = itemsArray.map((item: any) => item.id);
      setExcludedIds(prev => [...prev, ...newIds]);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch canvases");
    } finally {
      setLoading(false);
    }
  };

  const resetVotingSession = () => {
    setCanvasA(null);
    setCanvasB(null);
    setExcludedIds([]);
    setError(null);
    setVoteResult(null);
  };

  const handleVote = async (winnerId: string, loserId: string) => {
    setVoting(true);
    setError(null);
    
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winnerId, loserId }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setVoteResult(data);
                 // Update local state with new ELO ratings
         if (canvasA && canvasB) {
           if (canvasA.id === winnerId) {
             setCanvasA((prev: any) => ({ ...prev, elo: data.results.winner.newElo }));
             setCanvasB((prev: any) => ({ ...prev, elo: data.results.loser.newElo }));
           } else {
             setCanvasA((prev: any) => ({ ...prev, elo: data.results.loser.newElo }));
             setCanvasB((prev: any) => ({ ...prev, elo: data.results.winner.newElo }));
           }
         }
      } else {
        setError(data.error || "Failed to record vote");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to record vote");
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Canvas Voting</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pairs seen: {excludedIds.length / 2} | Excluded IDs: {excludedIds.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTwoCanvases}
            disabled={loading || voting}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Loading..." : "Get New Pair"}
          </button>
          <button
            onClick={resetVotingSession}
            disabled={loading || voting}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {voteResult && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
          <p className="font-medium">{voteResult.message}</p>
          <p className="text-sm">
            Winner: {voteResult.results.winner.oldElo} → {voteResult.results.winner.newElo} ELO (+1)
          </p>
          <p className="text-sm">
            Loser: {voteResult.results.loser.oldElo} → {voteResult.results.loser.newElo} ELO (-1)
          </p>
        </div>
      )}

      {!canvasA && !canvasB && !loading && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Click "Get New Pair" to start voting between canvas items.
        </p>
      )}

      {canvasA && canvasB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Canvas A */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 relative">
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Option A
            </div>
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              ELO: {canvasA.elo || 1000}
            </div>
            
            <div className="mt-8 space-y-2">
              {canvasA.title && (
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {canvasA.title}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {canvasA.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {canvasA.uid}
              </p>
              
              {/* Original Image */}
              {canvasA.img && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Original Image:</strong>
                  </p>
                  <img
                    src={canvasA.img}
                    alt="Canvas A Original"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
              {/* Transformed Image */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Transformed Image:</strong>
                </p>
                {canvasA.generated_image ? (
                  <img
                    src={canvasA.generated_image}
                    alt="Canvas A Transformed"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">None</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleVote(canvasA.id, canvasB.id)}
                disabled={voting}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {voting ? "Voting..." : "Vote for A"}
              </button>
            </div>
          </div>

          {/* Canvas B */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 relative">
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Option B
            </div>
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              ELO: {canvasB.elo || 1000}
            </div>
            
            <div className="mt-8 space-y-2">
              {canvasB.title && (
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {canvasB.title}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {canvasB.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {canvasB.uid}
              </p>
              
              {/* Original Image */}
              {canvasB.img && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Original Image:</strong>
                  </p>
                  <img
                    src={canvasB.img}
                    alt="Canvas B Original"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
              {/* Transformed Image */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Transformed Image:</strong>
                </p>
                {canvasB.generated_image ? (
                  <img
                    src={canvasB.generated_image}
                    alt="Canvas B Transformed"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">None</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleVote(canvasB.id, canvasA.id)}
                disabled={voting}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {voting ? "Voting..." : "Vote for B"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GetTwoLeastRecentlyUsedComponent() {
  const [lruItems, setLruItems] = useState<any[]>([]);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLruItems = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/getTwoLeastRecentlyUsed";
      if (excludedIds.length > 0) {
        url += `?excludeIds=${excludedIds.join(',')}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch least recently used items");
      }
      const response = await res.json();
      const data = response.data || response; // Handle both {data: []} and [] response formats
      
      // Ensure data is an array before using it
      const itemsArray = Array.isArray(data) ? data : [];
      
      // Add new items to the display
      setLruItems(prev => [...prev, ...itemsArray]);
      
      // Add the new IDs to the excluded list
      const newIds = itemsArray.map((item: any) => item.id);
      setExcludedIds(prev => [...prev, ...newIds]);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch least recently used items");
    } finally {
      setLoading(false);
    }
  };

  const resetLruItems = () => {
    setLruItems([]);
    setExcludedIds([]);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Least Recently Used Items</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fetched: {lruItems.length} items | Excluded: {excludedIds.length} IDs
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLruItems}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Loading..." : "Get Next 2 LRU"}
          </button>
          <button
            onClick={resetLruItems}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {lruItems.length === 0 && !loading && !error && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No items found. Click "Get Next 2 LRU" to load the least recently used items.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lruItems.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 relative"
          >
            <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              LRU #{index + 1}
            </div>
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              ELO: {item.elo || 1000}
            </div>
            <div className="space-y-2 mt-12">
              {item.title && (
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {item.title}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {item.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {item.uid}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Updated:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
              </p>
              
              {/* Original Image */}
              {item.img && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Original Image:</strong>
                  </p>
                  <img
                    src={item.img}
                    alt="Canvas"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
              {/* Transformed Image */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Transformed Image:</strong>
                </p>
                {item.generated_image ? (
                  <img
                    src={item.generated_image}
                    alt="Transformed Canvas"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">None</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListAllComponent() {
  const [canvasItems, setCanvasItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearResponse, setClearResponse] = useState<any>(null);

  const fetchAllItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/getAll");
      if (!res.ok) {
        throw new Error("Failed to fetch items");
      }
      const response = await res.json();
      const data = response.data || response; // Handle both {data: []} and [] response formats
      setCanvasItems(Array.isArray(data) ? data : []); // Ensure it's always an array
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const clearAllRecords = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL Canvas records? This action cannot be undone!"
    );
    
    if (!confirmed) return;

    setClearLoading(true);
    setClearResponse(null);
    setError(null);
    
    try {
      const res = await fetch("/api/clearRecords", {
        method: "DELETE",
      });
      
      const data = await res.json();
      setClearResponse(data);
      
      if (res.ok) {
        // Clear the local state since all records were deleted
        setCanvasItems([]);
      } else {
        setError(data.error || "Failed to clear records");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to clear records");
    } finally {
      setClearLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Canvas Items</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchAllItems}
            disabled={loading || clearLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={clearAllRecords}
            disabled={loading || clearLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {clearLoading ? "Clearing..." : "Clear All"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {clearResponse && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
          <p className="font-medium">{clearResponse.message}</p>
          {clearResponse.deletedCount !== undefined && (
            <p className="text-sm">Deleted {clearResponse.deletedCount} record(s)</p>
          )}
        </div>
      )}

      {canvasItems.length === 0 && !loading && !error && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No items found. Click "Refresh" to load items or submit a new canvas above.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {canvasItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 relative"
          >
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              ELO: {item.elo || 1000}
            </div>
            <div className="space-y-2 mt-8">
              {item.title && (
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {item.title}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {item.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {item.uid}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Updated:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
              </p>
              
              {/* Original Image */}
              {item.img && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Original Image:</strong>
                  </p>
                  <img
                    src={item.img}
                    alt="Canvas"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
              {/* Transformed Image */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Transformed Image:</strong>
                </p>
                {item.generated_image ? (
                  <img
                    src={item.generated_image}
                    alt="Transformed Canvas"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">None</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImgToImgComponent() {
  const [canvases, setCanvases] = useState<any[]>([]);
  const [selectedCanvas, setSelectedCanvas] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [saveResponse, setSaveResponse] = useState<any>(null);

  const fetchCanvases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/getAll");
      if (!res.ok) {
        throw new Error("Failed to fetch canvases");
      }
      const response = await res.json();
      const data = response.data || response; // Handle both {data: []} and [] response formats
      setCanvases(Array.isArray(data) ? data.filter((canvas: any) => canvas.img) : []); // Only canvases with images
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch canvases");
    } finally {
      setLoading(false);
    }
  };

  const handleTransform = async () => {
    if (!selectedCanvas || !prompt.trim()) {
      alert("Please select a canvas and enter a prompt");
      return;
    }

    setTransforming(true);
    setError(null);
    setResult(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const res = await fetch("/api/img2img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedCanvas.img,
          prompt: prompt.trim()
        }),
      });

      const endTime = performance.now();
      const duration = endTime - startTime;
      setResponseTime(duration);

      const data = await res.json();

      if (res.ok) {
        setResult({
          ...data,
          originalCanvas: selectedCanvas
        });
      } else {
        setError(data.error || "Failed to transform image");
      }
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setResponseTime(duration);
      setError(error instanceof Error ? error.message : "Failed to transform image");
    } finally {
      setTransforming(false);
    }
  };

  const saveTransformedImage = async () => {
    if (!result || !selectedCanvas) {
      alert("No transformation result to save");
      return;
    }

    setSaving(true);
    setSaveResponse(null);
    setError(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: selectedCanvas.uid,
          img: selectedCanvas.img, // Keep original image
          title: selectedCanvas.title,
          displayName: selectedCanvas.display_name,
          transformedImage: result.transformedImage
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveResponse(data);
        // Update the selected canvas with the new data
        if (data.data && data.data[0]) {
          setSelectedCanvas({ ...selectedCanvas, ...data.data[0] });
          // Also update the canvas in the list
          setCanvases(prev => prev.map(canvas => 
            canvas.uid === selectedCanvas.uid 
              ? { ...canvas, ...data.data[0] }
              : canvas
          ));
        }
      } else {
        setError(data.error || "Failed to save transformed image");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save transformed image");
    } finally {
      setSaving(false);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const resetTransform = () => {
    setSelectedCanvas(null);
    setPrompt("");
    setResult(null);
    setError(null);
    setResponseTime(null);
    setModalImage(null);
    setSaveResponse(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Image-to-Image Transformation</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchCanvases}
            disabled={loading || transforming}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Loading..." : "Load Canvases"}
          </button>
          <button
            onClick={resetTransform}
            disabled={loading || transforming}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {saveResponse && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
          <p className="font-medium">✅ Transformed image saved successfully!</p>
          <p className="text-sm">The transformed image has been added to the database record.</p>
        </div>
      )}

      {responseTime !== null && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md">
          <p className="text-sm">
            API Response Time: <span className="font-medium">{(responseTime / 1000).toFixed(2)}s</span>
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {!selectedCanvas && canvases.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select a Canvas to Transform:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                onClick={() => setSelectedCanvas(canvas)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors relative"
              >
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  ELO: {canvas.elo || 1000}
                </div>
                {canvas.title && (
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-6">
                    {canvas.title}
                  </p>
                )}
                
                {/* Original Image */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Original:</p>
                  <img
                    src={canvas.img}
                    alt="Canvas"
                    className="w-full h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(canvas.img);
                    }}
                  />
                </div>
                
                {/* Transformed Image */}
                <div className="mb-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transformed:</p>
                  {canvas.generated_image ? (
                    <img
                      src={canvas.generated_image}
                      alt="Transformed Canvas"
                      className="w-full h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(canvas.generated_image);
                      }}
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">None</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {canvas.uid}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCanvas && !result && (
        <div>
          <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Selected Canvas:</h3>
            <div className="flex gap-4">
              <img
                src={selectedCanvas.img}
                alt="Selected Canvas"
                className="w-32 h-32 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => openImageModal(selectedCanvas.img)}
              />
              <div className="flex-1">
                {selectedCanvas.title && (
                  <p className="font-semibold mb-1">{selectedCanvas.title}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>ELO:</strong> {selectedCanvas.elo || 1000}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>UID:</strong> {selectedCanvas.uid}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Transformation Prompt:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to transform the image (e.g., 'Same composition but in Studio Ghibli watercolor style, soft lighting')"
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 h-24 resize-none"
              disabled={transforming}
            />
          </div>

          <button
            onClick={handleTransform}
            disabled={transforming || !prompt.trim()}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            {transforming ? "Transforming..." : "Transform Image"}
          </button>
        </div>
      )}

      {result && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Transformation Result:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Original:</h4>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                {result.originalCanvas.title && (
                  <p className="font-semibold mb-2">{result.originalCanvas.title}</p>
                )}
                <img
                  src={result.originalCanvas.img}
                  alt="Original Canvas"
                  className="w-full h-64 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openImageModal(result.originalCanvas.img)}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  ELO: {result.originalCanvas.elo || 1000}
                </p>
              </div>
            </div>
            {/* Transformed Image */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Transformed:</h4>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <p className="font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
                  "{result.prompt}"
                </p>
                <img
                  src={result.transformedImage}
                  alt="Transformed Canvas"
                  className="w-full h-64 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openImageModal(result.transformedImage)}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Generated with OpenAI GPT-Image-1
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              onClick={saveTransformedImage}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {saving ? "Saving..." : "Save to Database"}
            </button>
            <button
              onClick={resetTransform}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Transform Another
            </button>
          </div>
        </div>
      )}

      {canvases.length === 0 && !loading && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No canvases found. Click "Load Canvases" to fetch available images for transformation.
        </p>
      )}

      {/* Full-screen Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={modalImage}
              alt="Full size view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SubmitTestComponent() {
  const [uid, setUid] = useState("");
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Function to generate a random UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleGenerateUID = () => {
    const newUid = generateUUID();
    setUid(newUid);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImg(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!uid || !img) {
      alert("Please provide both UID and an image");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, img, title }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Failed to submit" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Test Submit Route</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">User ID:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter user ID or generate random"
              className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={handleGenerateUID}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm"
            >
              Generate UUID
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter canvas title (optional)"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {img && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Preview:</p>
            <img src={img} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {response && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-sm font-medium">Response:</p>
            <pre className="text-xs overflow-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <SubmitTestComponent />
        
        <VotingComponent />
        
        <GetTwoLeastRecentlyUsedComponent />
        
        <ListAllComponent />

        <ImgToImgComponent />

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
