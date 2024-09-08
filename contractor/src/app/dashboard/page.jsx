"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
// import Invite from "../invite/page";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Invite from "@/component/Invite";

import Employees from "@/component/Employees";
import Sites from "@/component/Sites";
import Machines from "@/component/Machines";
import Home from "@/component/Home";

// contexts
import { DropdownContext } from "@/contexts/DropdownRendering";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  { name: "Home", current: true },
  { name: "Employees", current: false },
  { name: "Sites", current: false },
  { name: "Machines", current: false },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out" },
];

function Dashboard() {
  const router = useRouter();
  const [status, setStatus] = useState(false);
  const session = useSession();
  const [email, setEmail] = useState("");
  const google = localStorage.getItem("google");
  const [companies, setCompanies] = useState([]);
  const [userCompanies, setUserCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("useremail");
  const [currentSection, setCurrentSection] = useState("Home");
  const { dropdownOpen, toggleDropdown } = useContext(DropdownContext);

  const handleNavigationClick = (section) => {
    setCurrentSection(section);
  };

  const renderContent = () => {
    switch (currentSection) {
      case "Employees":
        return <Employees userCompanies={userCompanies} />;
      case "Sites":
        return <Sites />;
      case "Machines":
        return <Machines />;
      case "Home":
        return <Home />;
    }
  };

  useEffect(() => {
    setEmail(session?.data?.user?.email);
  }, [session]);

  useEffect(() => {
    if (email && google === "true") {
      const googleLogin = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/googleLoginToken",
            { email: email }
          );
          const { token } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("google", false);
        } catch (error) {
          alert("Invalid credentials");
          setStatus(false);
        }
      };
      googleLogin();
    }
  }, [email]);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/verify-token",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response)

        localStorage.setItem("email", response.data.user.email);

        if (!response.data.valid) {
          localStorage.removeItem("token");
          router.push("/login");
          console.log("Invalid token!");
        } else {
          const userId = response.data.user._id;
          fetchCompanies(userId);
          setStatus(true);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        router.push("/login");
        setStatus(false);
        console.log("Error verifying token!");
      }
    };

    const fetchCompanies = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/companies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompanies(response.data.companies);
        if (response.data.companies.length > 0) {
          setSelectedCompany(response.data.companies[0]._id); // Set initial selection
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    checkToken();
  }, [router]);

  // Fetch users whenever selectedCompany changes
  // const fetchUsersByCompany = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/users/company/66d8743bc662a6193e728ebc`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log(response);
  //     setUserCompanies(response.data.users);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // useEffect(() => {
  //   // if (!dropdownOpen) {
  //   // Only set up the interval if dropdown is not open
  //   fetchUsersByCompany(); // Initial fetch
  //   const intervalId = setInterval(fetchUsersByCompany, 1000); // Fetch every 5 seconds

  //   // Clean up the interval on component unmount or when dropdown opens
  //   return () => clearInterval(intervalId);
  //   // }
  // }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.setItem("google", false);
    signOut({ callbackUrl: "/login" });
  };

  console.log(userCompanies);

  return (
    <>
      <div className="min-h-max">
        <Popover as="header" className="bg-indigo-600 pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative flex items-center justify-center py-5 lg:justify-between">
              {/* Logo */}
              <div className="absolute left-0 flex-shrink-0 lg:static">
                <a href="#">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                    className="h-8 w-auto"
                  />
                </a>
              </div>

              {/* Right section on desktop */}
              <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                <button
                  type="button"
                  className="relative flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={user.imageUrl}
                        className="h-8 w-8 rounded-full"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:transform data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>

              {/* Search */}
              <div className="min-w-0 flex-1 px-12 lg:hidden">
                <div className="mx-auto w-full max-w-xs">
                  <label htmlFor="desktop-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative text-white focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </div>
                    <input
                      id="desktop-search"
                      name="search"
                      type="search"
                      placeholder="Search"
                      className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Menu button */}
              <div className="absolute right-0 flex-shrink-0 lg:hidden">
                {/* Mobile menu button */}
                <PopoverButton className="group relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-[open]:block"
                  />
                </PopoverButton>
              </div>
            </div>
            <div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
              <div className="grid grid-cols-3 items-center gap-8">
                <div className="col-span-2">
                  <nav className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.name === currentSection
                            ? "text-white"
                            : "text-indigo-100",
                          "rounded-md cursor-pointer bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigationClick(item.name);
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
                <div>
                  <div className="mx-auto w-full max-w-md">
                    <label htmlFor="mobile-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative text-white focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          aria-hidden="true"
                          className="h-5 w-5"
                        />
                      </div>
                      <input
                        id="mobile-search"
                        name="search"
                        type="search"
                        placeholder="Search"
                        className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <PopoverBackdrop
              transition
              className="fixed inset-0 z-20 bg-black bg-opacity-25 duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <PopoverPanel
              focus
              transition
              className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="pb-2 pt-3">
                  <div className="flex items-center justify-between px-4">
                    <div>
                      <img
                        alt="Your Company"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-8 w-auto"
                      />
                    </div>
                    <div className="-mr-2">
                      <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </PopoverButton>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Home
                    </a>
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Resources
                    </a>
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Company Directory
                    </a>
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Openings
                    </a>
                  </div>
                </div>
                <div className="pb-2 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        alt=""
                        src={user.imageUrl}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="truncate text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="truncate text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </div>
        </Popover>
        <main className="-mt-24 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <h2 id="section-1-title" className="sr-only">
                    Section title
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">{renderContent(currentSection)}</div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <h2 id="section-2-title" className="sr-only">
                    Section title
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      {currentSection === "Employees" ? <Invite /> : ""}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
              <span className="block sm:inline">
                &copy; 2021 Your Company, Inc.
              </span>{" "}
              <span className="block sm:inline">All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Dashboard;
