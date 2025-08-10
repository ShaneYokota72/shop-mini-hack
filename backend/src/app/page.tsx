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
      const data = await res.json();
      
      if (data.length < 2) {
        setError("Need at least 2 canvas items to start voting (may have exhausted unique pairs)");
        return;
      }
      
      setCanvasA(data[0]);
      setCanvasB(data[1]);
      
      // Add the new IDs to the excluded list
      const newIds = data.map((item: any) => item.id);
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {canvasA.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {canvasA.uid}
              </p>
              {canvasA.img && (
                <div className="mt-3">
                  <img
                    src={canvasA.img}
                    alt="Canvas A"
                    className="w-full h-48 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {canvasB.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {canvasB.uid}
              </p>
              {canvasB.img && (
                <div className="mt-3">
                  <img
                    src={canvasB.img}
                    alt="Canvas B"
                    className="w-full h-48 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
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
      const data = await res.json();
      
      // Add new items to the display
      setLruItems(prev => [...prev, ...data]);
      
      // Add the new IDs to the excluded list
      const newIds = data.map((item: any) => item.id);
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {item.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {item.uid}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Updated:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
              </p>
              {item.img && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Image:</strong>
                  </p>
                  <img
                    src={item.img}
                    alt="Canvas"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
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
      const data = await res.json();
      setCanvasItems(data);
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>ID:</strong> {item.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>UID:</strong> {item.uid}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Updated:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
              </p>
              {item.img && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Image:</strong>
                  </p>
                  <img
                    src={item.img}
                    alt="Canvas"
                    className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmitTestComponent() {
  const [uid, setUid] = useState("");
  const [img, setImg] = useState("");
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
        body: JSON.stringify({ uid, img }),
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
