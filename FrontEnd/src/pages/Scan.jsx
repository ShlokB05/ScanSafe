import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import AppHeader from "../components/AppHeader.jsx";

import { API } from "../lib/api.js"; // adjust path if needed



function BarcodeOverlay() {
  return (
    <div className="overlay">
      <div className="scan-frame">
        <div className="corner tl" />
        <div className="corner tr" />
        <div className="corner bl" />
        <div className="corner br" />
        <div className="scan-line" />
      </div>
      <div className="overlay-hint">Align the barcode inside the frame</div>
    </div>
  );
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrf() {
  await fetch(`${API}/auth/csrf/`, { credentials: "include" });
}
async function postForm(url, form) {
  await ensureCsrf();
  const csrftoken = getCookie("csrftoken");
  if (!csrftoken) throw new Error("Missing CSRF cookie.");

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRFToken": csrftoken },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Request failed");
  return data;
}

async function lookupByGtin(gtin) {
  const form = new FormData();
  form.append("mode", "gtin");
  form.append("gtin", gtin);
  return postForm("/api/scan/", form);
}

async function uploadIngredients(file, gtin) {
  const form = new FormData();
  form.append("mode", "ingredients");
  if (gtin) form.append("gtin", gtin); // allow upload even if gtin is missing
  form.append("image", file);
  return postForm("/api/scan/", form);
}

function uniq(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

function normalizeUnknown(u) {
  if (!Array.isArray(u)) return [];
  return u.map((x) => (Array.isArray(x) ? x.join(" ") : String(x)));
}

export default function Scan() {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);

  // prevents backend spam once we got a scan + result
  const lockedRef = useRef(false);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [pendingGtin, setPendingGtin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
  };

  const startScanner = async () => {
    try {
      setErr("");

      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.UPC_A,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints, 250);

      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const controls = await reader.decodeFromConstraints(
        constraints,
        videoRef.current,
        async (scanResult, scanErr) => {
          // ignore normal “no code found yet” frames
          if (scanErr && scanErr?.name === "NotFoundException") return;
          if (scanErr) {
            const msg = scanErr?.message || "";
            if (scanErr?.name === "NotFoundException" || msg.includes("No MultiFormat Readers")) return;
            setErr(msg);
            return;
          }

          if (!scanResult) return;

          // ✅ only fire ONE backend lookup until user hits Rescan
          if (lockedRef.current) return;

          const gtin = scanResult.getText();
          lockedRef.current = true;

          setLoading(true);
          setErr("");
          setResult(null);

          try {
            const r = await lookupByGtin(gtin);
            setResult(r);

            const effectiveGtin = r?.gtin || gtin;
            setPendingGtin(effectiveGtin);

            if (r?.cache === "miss" || r?.next === "ingredients_photo") {
              setShowPopup(true);
            }
          } catch (e) {
            setErr(e?.message || "Lookup failed");
            lockedRef.current = false; // allow retry if lookup failed
          } finally {
            setLoading(false);
          }
        }
      );

      controlsRef.current = controls;
    } catch (e) {
      setErr(e?.message || "Camera permission denied or unavailable.");
    }
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verified = uniq((result?.matches || []).map((m) => m?.[0]));
  const flagged = uniq(result?.flagged || []);
  const unknown = uniq(normalizeUnknown(result?.unknown || []));

  return (
    <div className="app">
      <AppHeader />
      <main className="scan-page">
        {/* LEFT / TOP UI */}
        <div style={{ padding: 12 }}>
          {loading ? <div>Scanning…</div> : null}
          {err ? <div style={{ paddingTop: 8 }}>{err}</div> : null}

          <div style={{ paddingTop: 8, display: "flex", gap: 8 }}>
           

            <button
              type="button"
              onClick={() => {
                setErr("");
                setLoading(false);
                setResult(null);
                setShowPopup(false);
                setPendingGtin(null);
                lockedRef.current = false; // ✅ allow a fresh backend call
              }}
            >
              Rescan
            </button>
          </div>

          {/* ✅ CLEAN RESULTS UI (NO JSON) */}
          {result ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                GTIN: <b>{result.gtin || pendingGtin || "—"}</b> • Source:{" "}
                <b>{result.gtin_source || "—"}</b> • Cache: <b>{result.cache || "—"}</b>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Verified</div>
                {verified.length ? (
                  <ul style={{ marginTop: 6 }}>
                    {verified.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ marginTop: 6, opacity: 0.8 }}>None</div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Flagged</div>
                {flagged.length ? (
                  <ul style={{ marginTop: 6 }}>
                    {flagged.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ marginTop: 6, opacity: 0.8 }}>None</div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Unknown</div>
                {unknown.length ? (
                  <ul style={{ marginTop: 6 }}>
                    {unknown.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ marginTop: 6, opacity: 0.8 }}>None</div>
                )}
              </div>
            </div>
          ) : null}

          {/* ✅ POPUP */}
          {showPopup ? (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "white",
              }}
            >
              <div style={{ marginBottom: 8 }}>
                Upload a photo of the ingredients label.
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Saving under GTIN: <b>{pendingGtin || "(none yet)"}</b>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setErr("");
                  setLoading(true);

                  try {
                    const r2 = await uploadIngredients(file, pendingGtin);
                    setResult(r2);
                    if (r2?.gtin) setPendingGtin(r2.gtin);
                    setShowPopup(false);
                  } catch (e2) {
                    setErr(e2?.message || "Ingredients upload failed");
                  } finally {
                    setLoading(false);
                    e.target.value = "";
                  }
                }}
              />

              <div style={{ marginTop: 8 }}>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* CAMERA (KEEP OVERLAY) */}
        <div className="camera">
          <video ref={videoRef} className="video" playsInline muted />
          <BarcodeOverlay />
        </div>
      </main>
    </div>
  );
}
