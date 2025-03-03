"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from 'next/image';

import { auth, db } from "@/app/Firebase/config";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [familyId, setFamilyId] = useState("");
  const [isPPPVisible, setIsPPPVisible] = useState(false);
  const [isPension, setIsPension] = useState(false);
  const [ChangeRequest, setChangeRequest] = useState(false)
  const [AddharNumber, setAddharNumber] = useState(false)
  // here is the request handlers and all code 
  const [realFather, setRealFather] = useState("")
  const [realMother, setRealMother] = useState("")
  const [NewFather, setNewFather] = useState("")
  const [NewMother, setNewMother] = useState("")
  const [Mob, setMob] = useState("")
  const onRequestHandlers = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await setDoc(doc(db, "Requests", `${new Date().getTime()}`), {
        User: user?.email,
        realFather,
        realMother,
        NewFather,
        NewMother,
        Mob,
      }).then(() => {
        toast.success("Request submitted successfully!");
      });
      setRealFather("");
      setRealMother("");
      setNewFather("");
      setNewMother("");
      setMob("");
    } catch (error) {
      console.error("Error submitting request: ", error);
      toast.error("Failed to submit request.");
    }
  };
  // close request handler

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!user && !loggedInUser) {
      router.push("/Login");
    }
  }, [user, router]);

  const PPPHandler = () => {
    setIsPPPVisible(true);
    setIsPension(false);
    setChangeRequest(false)
    setAddharNumber(false)
  };

  const PensionHandler = () => {
    setIsPension(true);
    setIsPPPVisible(false);
    setChangeRequest(false)
    setAddharNumber(false)
  };

  const OnLogoutHandler = () => {
    signOut(auth);
    localStorage.removeItem("user");
  };
  const ChangeRequestHandlers = () => {
    setChangeRequest(true)
    setIsPPPVisible(false)
    setIsPension(false)
    setAddharNumber(false)
  }
  const clearAllHandler = () => {
    setChangeRequest(false)
    setIsPPPVisible(false)
    setIsPension(false)
    setAddharNumber(false)
  }
  const FindByAddharNo = () => {
    setChangeRequest(false)
    setIsPPPVisible(false)
    setIsPension(false)
    setAddharNumber(true)
  }
  const handleSubmit = () => {
    if (familyId) {
      const urlPP = `${process.env.NEXT_PUBLIC_BASEMANAGMENT}/Family/PrintFamilyDetails?familyId=${familyId}`;
      window.open(urlPP, "_blank");
    } else {
      console.log("Please enter a valid Family ID!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gradient-to-r bg-transparent text-white p-6 md:fixed h-full border-r border-gray-800">
        <div onClick={clearAllHandler} className="flex items-center justify-center mb-8">
        <Image
            src="https://img.icons8.com/?size=100&id=103413&format=png&color=ffffff"
            alt="Logo"
            className="h-12"
            width={48}  // Adjust width as needed
            height={48} // Adjust height as needed
          />
          <span className="ml-3 text-2xl font-semibold hidden md:block">Print Portal</span>
        </div>
        <ul className="space-y-6">
          <li onClick={PPPHandler}>
            <a className="flex items-center space-x-3 cursor-pointer hover:bg-indigo-600 p-2 rounded-lg transition duration-200">
              <span className="text-lg font-medium">PPP Print</span>
            </a>
          </li>
          <li>
            <a
              href="https://fasal.haryana.gov.in/home/login"
              target="_blank"
              className="flex items-center space-x-3 hover:bg-indigo-600 p-2 rounded-lg transition duration-200"
            >
              <span className="text-lg font-medium">Addhar to PPP</span>
            </a>
          </li>
          <li onClick={PensionHandler}>
            <a className="flex items-center space-x-3 cursor-pointer hover:bg-indigo-600 p-2 rounded-lg transition duration-200">
              <span className="text-lg font-medium">Search Pension</span>
            </a>
          </li>

          <li onClick={ChangeRequestHandlers} >
            <a
              href="#"
              className="flex items-center space-x-3 hover:bg-indigo-600 p-2 rounded-lg transition duration-200"
            >
              <span className="text-lg font-medium">Change Request</span>
            </a>
          </li>


          <li onClick={FindByAddharNo} >
            <a
              href="#"
              className="flex items-center space-x-3 hover:bg-indigo-600 p-2 rounded-lg transition duration-200"
            >
              <span className="text-lg font-medium">Find Addhar Number</span>
            </a>
          </li>

          <li onClick={OnLogoutHandler}>
            <a
              href="#"
              className="flex items-center space-x-3 hover:bg-indigo-600 p-2 rounded-lg transition duration-200"
            >
              <span className="text-lg font-medium">Logout</span>
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 bg-black">
        <nav className="bg-gray-800 shadow-xl p-4 mb-8 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <h2 className="text-2xl font-semibold">{user?.email}</h2>
          </div>
        </nav>
        {
          AddharNumber && (
            <Card className="bg-slate-900 border-transparent">
            <form className="flex flex-col p-5 justify-center text-center items-center"
              action={`${process.env.NEXT_PUBLIC_BASEMANAGMENT}/AddNewFamily/GetResponse`}
              method="POST"
              target="_blank"
              onSubmit={(e) => {
                e.preventDefault();
                const aadhaarInput = document.getElementById('aadhaar-input') as HTMLInputElement;
                if (aadhaarInput) {
                  const aadhaarNumber = aadhaarInput.value;
                  if (aadhaarNumber) {
                    aadhaarInput.value = btoa(aadhaarNumber);
                    const form = e.target as HTMLFormElement;
                    form.submit();
                  }
                }
              }}
            >
              <input
                type="text"
                id="aadhaar-input"
                name="Aadahr"
                className="text-white bg-black p-2 w-[50%] mb-3 outline-none rounded-sm"
                placeholder="Enter the Aadhaar Number:"
              />
              <input type="submit" value="Submit" className="cursor-pointer hover:bg-green-600 p-2 rounded-sm w-[20%] bg-slate-500" />
            </form>
            </Card>
          )
        }
        {isPPPVisible && (
          <div className="flex flex-col items-center gap-6">
            <Card className="p-4 shadow-lg rounded-lg bg-gray-800">
              <p className="text-gray-400 text-lg">
                <span className="text-red-400 font-bold">Info:</span> Enter the Family ID
                and submit to redirect to the PPP website. Log in there, return,
                and enter the Family ID again to get details.
              </p>
              <Input
                type="text"
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                placeholder="Enter the Family ID"
                className="border-gray-500 p-2 rounded-md w-full max-w-md mt-4 bg-gray-700 text-white"
              />
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 text-white p-2 rounded-md w-full max-w-md mt-4"
              >
                Submit
              </Button>
            </Card>
          </div>
        )}

        {isPension && (
          <form
            action={`${process.env.NEXT_PUBLIC_BASEMANAGMENT}/PensionEnquiry/Search`}
            method="post"
            target="_blank"
            className="flex flex-col items-center gap-6"
          >
            <h1 className="text-gray-400 text-xl mb-6">Search For Pensions (Exclusion / ProActive)</h1>
            <div className="flex flex-col gap-6 w-full max-w-md">
              <div>
                <Label htmlFor="txtSelectedFamilyId" className="text-sm font-medium text-gray-300">Family Id:</Label>
                <Input
                  id="txtSelectedFamilyId"
                  name="SelectedFamilyId"
                  type="text"
                  placeholder="Enter Your Family Id here"
                  className="w-full border-gray-500 p-2 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="ddlSelectedSearchType" className="text-sm font-medium text-gray-300">Search IN:</Label>
                <select
                  id="ddlSelectedSearchType"
                  name="SelectedSearchType"
                  className="form-control border border-gray-500 rounded-md p-2 w-full bg-gray-700 text-white"
                >
                  <option value="">Please select</option>
                  <option value="PROACTIVE">PROACTIVE</option>
                  <option value="EXCLUSION">EXCLUSION</option>
                </select>
              </div>
              <Button type="submit" className="bg-green-500 cursor-pointer text-white p-3 rounded-md w-full">
                Search
              </Button>
            </div>
          </form>
        )}
        {ChangeRequest && (
          <>
            <Card className="p-2 bg-black">
              <h1
                className="text-white text-xl mb-3 text-center"
              >Send Request for Changing the Father and Mother Name</h1>
              <form >
                <Input
                  value={realFather}
                  onChange={(e) => { setRealFather(e.target.value) }}
                  type="text"
                  placeholder="Enter the Real Father Name in the Family Id:"
                  className="w-full border-gray-500 p-2 rounded-md bg-black text-white mb-1"
                />
                <Input
                  value={realMother}
                  onChange={(e) => { setRealMother(e.target.value) }}
                  type="text"
                  placeholder="Enter the Real Mother Name in the Family Id:"
                  className="w-full border-gray-500 p-2 rounded-md bg-black text-white"
                />
                <h1 className="text-white text-center">Enter the Data You want to Change</h1>
                <Input
                  value={NewFather}
                  onChange={(e) => { setNewFather(e.target.value) }}
                  type="text"
                  placeholder="Enter the New Father Name in the Family Id:"
                  className="w-full border-gray-500 p-2 rounded-md bg-black text-white mb-1"
                />
                <Input
                  value={NewMother}
                  onChange={(e) => { setNewMother(e.target.value) }}
                  type="text"
                  placeholder="Enter the New Mother Name in the Family Id:"
                  className="w-full border-gray-500 p-2 mb-5 rounded-md bg-black text-white"
                />
                <Input
                  value={Mob}
                  onChange={(e) => { setMob(e.target.value) }}
                  type="text"
                  placeholder="Your Mobile Number:"
                  className="w-full border-gray-500 p-2  rounded-md bg-black text-white"
                  required
                />
                <h2 className="mb-5 text-red-400">Warning: If you Enter Wrong Contact Details your Request will not Approve</h2>

                <Button onClick={onRequestHandlers} className="flex w-[100%] justify-center text-center items-center">
                  Send Request
                </Button>
              </form>
            </Card>
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}
