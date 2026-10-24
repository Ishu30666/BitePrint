
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { auth } from "@/app/Firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";

import { encryptApplicationNumber } from "@/lib/encryption";

type ElectricityBoard = "UHBVN" | "DHBVN";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [familyId, setFamilyId] = useState("");
  const [isPPPVisible, setIsPPPVisible] = useState(false);
  const [isPension, setIsPension] = useState(false);
  const [addharNumber, setAddharNumber] = useState(false);
  const [isElectricity, setIsElectricity] = useState(false);
  const [isRapdrp, setIsRapdrp] = useState(false);
  const [isSolar, setIsSolar] = useState(false);

  const [applicationNumber, setApplicationNumber] = useState("");
  const [electricityBoard, setElectricityBoard] =
    useState<ElectricityBoard>("DHBVN");

  const [uuid, setUuid] = useState("");
  const [rapdrpBoard, setRapdrpBoard] =
    useState<ElectricityBoard>("UHBVN");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");

    if (!user && !loggedInUser) {
      router.push("/Login");
    }
  }, [user, router]);

  const clearAllHandler = () => {
    setIsPPPVisible(false);
    setIsPension(false);
    setAddharNumber(false);
    setIsElectricity(false);
    setIsRapdrp(false);
    setIsSolar(false);
  };

  const PPPHandler = () => {
    clearAllHandler();
    setIsPPPVisible(true);
  };

  const PensionHandler = () => {
    clearAllHandler();
    setIsPension(true);
  };

  const FindByAddharNo = () => {
    clearAllHandler();
    setAddharNumber(true);
  };

  const ElectricityHandler = () => {
    clearAllHandler();
    setIsElectricity(true);
  };

  const RapdrpHandler = () => {
    clearAllHandler();
    setIsRapdrp(true);
  };

  const SolarHandler = () => {
    clearAllHandler();
    setIsSolar(true);
  };

  const OnLogoutHandler = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      router.push("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to log out. Please try again.");
    }
  };

  // PPP Print — original URL
   const handleSubmit = () => {
    if (familyId) {
      const urlPP = `${process.env.NEXT_PUBLIC_BASEMANAGMENT}/Family/PrintFamilyDetails?familyId=${familyId}`;
      window.open(urlPP, "_blank");
    } else {
      console.log("Please enter a valid Family ID!");
    }
  };

  // UHBVN / DHBVN — original hostnames and encryption logic
  const handleElectricitySearch = () => {
    const appNumber = applicationNumber.trim();

    if (!appNumber) {
      toast.error("Please enter an application number.");
      return;
    }

    try {
      const encrypted = encryptApplicationNumber(appNumber);

      const hostname =
        electricityBoard === "UHBVN"
          ? "https://econnection.uhbvn.org.in"
          : "https://econnection.dhbvn.org.in";

      const destination =
        `${hostname}/ConnectionConsumerDashBoard.aspx?${encrypted}`;

      window.open(destination, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Application search failed:", error);
      toast.error("Unable to process the application number.");
    }
  };

  // SOLAR — new option; uses the solar host for both boards
  const handleSolarSearch = () => {
    const appNumber = applicationNumber.trim();

    if (!appNumber) {
      toast.error("Please enter a solar application number.");
      return;
    }

    try {
      const encrypted = encryptApplicationNumber(appNumber);

      const hostname = "https://esolarconn.dhbvn.org.in";

      const destination =
        `${hostname}/ConnectionConsumerDashBoard.aspx?${encrypted}`;

      window.open(destination, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Solar application search failed:", error);
      toast.error("Unable to process the solar application number.");
    }
  };

  // RAPDRP — direct redirect, no encryption
  const handleRapdrpSearch = () => {
    const number = uuid.trim();

    if (!/^\d+$/.test(number)) {
      toast.error("Please enter a valid number.");
      return;
    }

    const hostname =
      rapdrpBoard === "UHBVN"
        ? "https://uhbvn.org.in"
        : "https://dhbvn.org.in";

    const destination =
      `${hostname}/Rapdrp/BD?UID=${encodeURIComponent(number)}`;

    window.open(destination, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-r border-gray-800 bg-transparent p-6 text-white md:fixed md:h-screen md:w-64">
        <div
          onClick={clearAllHandler}
          className="mb-8 flex cursor-pointer items-center justify-center"
        >
          <img
            src="https://img.icons8.com/?size=100&id=IBgUXg3MQlTW&format=png&color=000000"
            alt="Logo"
            className="h-12 w-12"
          />

          <span className="ml-3 hidden text-2xl font-semibold md:block">
            Print Portal
          </span>
        </div>

        <ul className="space-y-4">
          <li>
            <button
              type="button"
              onClick={PPPHandler}
              className="w-full rounded-lg p-2 text-left transition hover:bg-indigo-600"
            >
              PPP Print
            </button>
          </li>

          <li>
            <a
              href="https://fasal.haryana.gov.in/home/login"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg p-2 transition hover:bg-indigo-600"
            >
              Aadhaar to PPP
            </a>
          </li>

          <li>
            <button
              type="button"
              onClick={PensionHandler}
              className="w-full rounded-lg p-2 text-left transition hover:bg-indigo-600"
            >
              Search Pension
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={FindByAddharNo}
              className="w-full rounded-lg p-2 text-left transition hover:bg-indigo-600"
            >
              Find Aadhaar Number
            </button>
          </li>

          {/* Admin-only options */}
          {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <>
              <li>
                <button
                  type="button"
                  onClick={ElectricityHandler}
                  className="w-full rounded-lg p-2 text-left transition hover:bg-indigo-600"
                >
                  UHBVN &amp; DHBVN
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={RapdrpHandler}
                  className="w-full rounded-lg p-2 text-left transition hover:bg-indigo-600"
                >
                  RAPDRP Search
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={SolarHandler}
                  className="w-full rounded-lg p-2 text-left transition hover:bg-green-600"
                >
                  Solar Search
                </button>
              </li>
            </>
          )}

          <li>
            <button
              type="button"
              onClick={OnLogoutHandler}
              className="w-full rounded-lg p-2 text-left transition hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 bg-black p-4 md:ml-64 md:p-6">
        <nav className="mb-8 rounded-lg bg-gray-800 p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <h2 className="break-all text-sm font-medium md:text-lg">
              {user?.email}
            </h2>
          </div>
        </nav>

        {/* Find Aadhaar Number */}
        {addharNumber && (
          <Card className="border-transparent bg-slate-900 p-5">
            <form
              className="flex flex-col items-center justify-center gap-3"
              action={`${process.env.NEXT_PUBLIC_BASEMANAGMENT}/AddNewFamily/GetResponse`}
              method="POST"
              target="_blank"
              onSubmit={(e) => {
                const input = e.currentTarget.elements.namedItem(
                  "Aadahr"
                ) as HTMLInputElement | null;

                if (!input?.value.trim()) {
                  e.preventDefault();
                  toast.error("Please enter the Aadhaar number.");
                  return;
                }

                input.value = btoa(input.value.trim());
              }}
            >
              <Label htmlFor="aadhaar-input">
                Enter Aadhaar Number
              </Label>

              <Input
                type="text"
                id="aadhaar-input"
                name="Aadahr"
                placeholder="Enter Aadhaar number"
                className="w-full bg-black text-white md:w-1/2"
                required
              />

              <Button type="submit" className="w-full md:w-1/4">
                Submit
              </Button>
            </form>
          </Card>
        )}

        {/* PPP Print */}
        {isPPPVisible && (
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-lg rounded-lg bg-gray-800 p-5">
              <p className="mb-4 text-gray-300">
                <span className="font-bold text-red-400">Info: </span>
                Enter the Family ID and submit to open the PPP website.
              </p>

              <Label htmlFor="familyId">Family ID</Label>

              <Input
                id="familyId"
                type="text"
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                placeholder="Enter Family ID"
                className="mt-2 bg-gray-700 text-white"
              />

              <Button
                type="button"
                onClick={handleSubmit}
                className="mt-4 w-full bg-blue-600"
              >
                Submit
              </Button>
            </Card>
          </div>
        )}

        {/* Pension Search — original URL */}
        {isPension && (
          <form
            action={`${process.env.NEXT_PUBLIC_BASEMANAGMENT}/PensionEnquiry/Search`}
            method="post"
            target="_blank"
            className="mx-auto flex w-full max-w-lg flex-col gap-5"
          >
            <h2 className="text-center text-xl text-gray-300">
              Search for Pensions (Exclusion / ProActive)
            </h2>

            <div>
              <Label htmlFor="txtSelectedFamilyId">Family ID</Label>

              <Input
                id="txtSelectedFamilyId"
                name="SelectedFamilyId"
                type="text"
                placeholder="Enter your Family ID"
                className="mt-2 bg-gray-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="ddlSelectedSearchType">Search In</Label>

              <select
                id="ddlSelectedSearchType"
                name="SelectedSearchType"
                defaultValue=""
                required
                className="mt-2 w-full rounded-md border border-gray-500 bg-gray-700 p-3 text-white"
              >
                <option value="" disabled>
                  Please select
                </option>
                <option value="PROACTIVE">PROACTIVE</option>
                <option value="EXCLUSION">EXCLUSION</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Search
            </Button>
          </form>
        )}

        {/* UHBVN / DHBVN Application Search — unchanged */}
        {isElectricity && (
          <Card className="mx-auto w-full max-w-lg border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-5 text-center text-xl font-semibold">
              Electricity Application Search
            </h2>

            <div className="mb-4">
              <Label htmlFor="electricityBoard">
                Select Electricity Board
              </Label>

              <select
                id="electricityBoard"
                value={electricityBoard}
                onChange={(e) =>
                  setElectricityBoard(
                    e.target.value as ElectricityBoard
                  )
                }
                className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              >
                <option value="DHBVN">
                  DHBVN — Dakshin Haryana Bijli Vitran Nigam
                </option>
                <option value="UHBVN">
                  UHBVN — Uttar Haryana Bijli Vitran Nigam
                </option>
              </select>
            </div>

            <div className="mb-5">
              <Label htmlFor="applicationNumber">
                Application Number
              </Label>

              <Input
                id="applicationNumber"
                type="text"
                value={applicationNumber}
                onChange={(e) =>
                  setApplicationNumber(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleElectricitySearch();
                  }
                }}
                placeholder="Enter application number"
                className="mt-2 bg-gray-800 text-white"
                required
              />
            </div>

            <Button
              type="button"
              onClick={handleElectricitySearch}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Search Application
            </Button>
          </Card>
        )}

        {/* Solar Application Search — new option */}
        {isSolar && (
          <Card className="mx-auto w-full max-w-lg border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-5 text-center text-xl font-semibold">
              Solar Application Search
            </h2>

            <div className="mb-5">
              <Label htmlFor="solarApplicationNumber">
                Application Number
              </Label>

              <Input
                id="solarApplicationNumber"
                type="text"
                value={applicationNumber}
                onChange={(e) =>
                  setApplicationNumber(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSolarSearch();
                  }
                }}
                placeholder="Enter solar application number"
                className="mt-2 bg-gray-800 text-white"
                required
              />
            </div>

            <Button
              type="button"
              onClick={handleSolarSearch}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Search Solar Application
            </Button>
          </Card>
        )}

        {/* RAPDRP Search — unchanged */}
        {isRapdrp && (
          <Card className="mx-auto w-full max-w-lg border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-5 text-center text-xl font-semibold">
              RAPDRP Search
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRapdrpSearch();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <Label htmlFor="rapdrpBoard">
                  Select Electricity Board
                </Label>

                <select
                  id="rapdrpBoard"
                  value={rapdrpBoard}
                  onChange={(e) =>
                    setRapdrpBoard(
                      e.target.value as ElectricityBoard
                    )
                  }
                  className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
                >
                  <option value="UHBVN">UHBVN</option>
                  <option value="DHBVN">DHBVN</option>
                </select>
              </div>

              <div>
                <Label htmlFor="rapdrp-number">Enter Number</Label>

                <Input
                  id="rapdrp-number"
                  type="text"
                  inputMode="numeric"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                  placeholder="Enter number"
                  className="mt-2 bg-gray-800 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Open RAPDRP
              </Button>
            </form>
          </Card>
        )}
      </main>

      <ToastContainer theme="dark" position="top-right" />
    </div>
  );
}
