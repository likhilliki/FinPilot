import React, { useState } from "react";
import { 
  FileText, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, 
  UploadCloud, Scan, UserCheck, ShieldAlert 
} from "lucide-react";
import { OnboardingStatus } from "../types";

interface OnboardingFlowProps {
  onboardingState: OnboardingStatus;
  setOnboardingState: React.Dispatch<React.SetStateAction<OnboardingStatus>>;
  setDigitalAdoptionScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function OnboardingFlow({ 
  onboardingState, 
  setOnboardingState,
  setDigitalAdoptionScore
}: OnboardingFlowProps) {
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isFaceLoading, setIsFaceLoading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<"passport" | "driver_license">("passport");

  const runOcrScan = async () => {
    setIsOcrLoading(true);
    try {
      const response = await fetch("/api/onboarding/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: selectedDocType })
      });
      const data = await response.json();
      if (data.success) {
        setOnboardingState(prev => ({
          ...prev,
          step: "ocr",
          ocrData: data.ocrData
        }));
        setDigitalAdoptionScore(data.digitalAdoptionScore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  const runFaceMatch = async () => {
    setIsFaceLoading(true);
    try {
      const response = await fetch("/api/onboarding/face", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.success) {
        setOnboardingState(prev => ({
          ...prev,
          step: "kyc_complete",
          faceVerified: true,
          complianceChecked: true
        }));
        setDigitalAdoptionScore(data.digitalAdoptionScore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFaceLoading(false);
    }
  };

  const handleReset = () => {
    setOnboardingState({
      step: "start",
      ocrData: undefined,
      faceVerified: false,
      complianceChecked: false
    });
    setDigitalAdoptionScore(40);
  };

  const isOcrComplete = !!onboardingState.ocrData;
  const isFaceComplete = !!onboardingState.faceVerified;
  const isKycComplete = onboardingState.step === "kyc_complete";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Component Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <Scan className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">AI KYC Onboarding Hub</h3>
              <p className="text-[10px] font-mono text-slate-500">Regulatory Verification Pipeline</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            isKycComplete 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}>
            {isKycComplete ? "Status: Verified" : "Status: Pending KYC"}
          </span>
        </div>

        {/* Dynamic Verification Board */}
        {isKycComplete ? (
          <div className="flex flex-col items-center justify-center text-center py-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 p-5 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400">Autonomous KYC Verified Successfully</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your ID credentials and live biometrics have matched perfectly. RBI sovereign clearance active.
              </p>
            </div>
            {onboardingState.ocrData && (
              <div className="w-full text-left bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[10px] text-slate-400">
                <p><span className="text-slate-500">EXTRACTED NAME :</span> <span className="text-slate-200">{onboardingState.ocrData.name}</span></p>
                <p><span className="text-slate-500">ID NUMBER      :</span> <span className="text-slate-200">{onboardingState.ocrData.idNumber}</span></p>
                <p><span className="text-slate-500">DOB            :</span> <span className="text-slate-200">{onboardingState.ocrData.dob}</span></p>
                <p><span className="text-slate-500">COMPLIANCE CODE:</span> <span className="text-emerald-400">SECURE-9842A</span></p>
              </div>
            )}
            <button
              id="reset-kyc-btn"
              onClick={handleReset}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
            >
              Reset for testing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Step 1: Document Upload / OCR Selection */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                    isOcrComplete ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  }`}>
                    {isOcrComplete ? "✓" : "1"}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">Submit Identification (OCR Scan)</span>
                </div>
                {isOcrComplete && <span className="text-[10px] font-mono text-emerald-400">{onboardingState.ocrData?.confidence}% Conf</span>}
              </div>

              {!isOcrComplete ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      id="passport-doc-btn"
                      onClick={() => setSelectedDocType("passport")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium border transition-colors ${
                        selectedDocType === "passport" 
                          ? "bg-slate-800 border-slate-600 text-white" 
                          : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      International Passport
                    </button>
                    <button
                      id="dl-doc-btn"
                      onClick={() => setSelectedDocType("driver_license")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium border transition-colors ${
                        selectedDocType === "driver_license" 
                          ? "bg-slate-800 border-slate-600 text-white" 
                          : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      National Driver License
                    </button>
                  </div>

                  <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center flex flex-col items-center bg-slate-950/50">
                    <UploadCloud className="h-6 w-6 text-slate-500 mb-1" />
                    <p className="text-[11px] text-slate-400">Clicking triggers OCR engine simulation.</p>
                    <button
                      id="run-ocr-scan-btn"
                      onClick={runOcrScan}
                      disabled={isOcrLoading}
                      className="mt-3 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/15 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isOcrLoading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Processing Document OCR...
                        </>
                      ) : (
                        <>
                          <Scan className="h-3.5 w-3.5" />
                          Analyze & Verify Document
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HOLDER NAME :</span>
                    <span className="text-slate-200">{onboardingState.ocrData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID NUMBER   :</span>
                    <span className="text-slate-200">{onboardingState.ocrData?.idNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DOB         :</span>
                    <span className="text-slate-200">{onboardingState.ocrData?.dob}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Biometric Face Match */}
            <div className={`rounded-xl border border-slate-800 bg-slate-900/20 p-4 space-y-3 transition-opacity ${
              !isOcrComplete ? "opacity-40 pointer-events-none" : ""
            }`}>
              <div className="flex items-center gap-2">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                  isFaceComplete ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}>
                  {isFaceComplete ? "✓" : "2"}
                </span>
                <span className="text-xs font-semibold text-slate-200">Biometric Face Matching (Live Photo)</span>
              </div>

              {!isFaceComplete ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center flex flex-col items-center bg-slate-950/50">
                  <UserCheck className="h-6 w-6 text-slate-500 mb-1" />
                  <p className="text-[11px] text-slate-400">Align face to capture frame match similarity.</p>
                  <button
                    id="run-face-match-btn"
                    onClick={runFaceMatch}
                    disabled={isFaceLoading || !isOcrComplete}
                    className="mt-3 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/15 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isFaceLoading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Running Biometric match...
                      </>
                    ) : (
                      <>
                        <Scan className="h-3.5 w-3.5" />
                        Capture & Confirm Photo
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-500/5 rounded-lg border border-emerald-500/10 p-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Face Verification Completed Successfully</span>
                </div>
              )}
            </div>

            {/* Compliance Note */}
            <div className="flex gap-2 p-3 rounded-lg bg-slate-900/30 border border-slate-850 text-[11px] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <p>Onboarding meets FDIC, RBI, and standard PII privacy protocols. All documents are destroyed post extraction.</p>
            </div>

          </div>
        )}
      </div>

      <div className="mt-4 border-t border-slate-900 pt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>AI Audit ID: P-84918-B</span>
          <span>Security protocol: AES-256</span>
        </div>
      </div>
    </div>
  );
}
