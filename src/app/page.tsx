
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

  // PPP Print — matches the old portal's FamilyIdHandlers logic
  const handleSubmit = () => {
    if (familyId) {
      const urlPP = `https://ppp-office.haryana.gov.in/Family/PrintFamilyDetails?familyId=${familyId}`;
      window.open(urlPP, "_blank");
    } else {
      toast.error("Please enter a valid Family ID!");
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
