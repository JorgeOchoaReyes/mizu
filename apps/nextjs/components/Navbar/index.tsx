import React from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

interface NavbarProps {
  title: string;
}

const Navbar = ({ title }: NavbarProps) => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {sessionData ? (
              <>
                <li>
                  <a href="/library">Home</a>
                </li>
                <li>
                  <a href="/settings">Settings</a>
                </li>
              </>
            ) : (
              <li>
                <a href="/">Home</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <label htmlFor="my-drawer" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
        </div>
        <div className="navbar-center">
          {sessionData ? (
            <>
              <a href="/library" className="btn btn-ghost text-xl normal-case">
                Home
              </a>
              <a href="/settings" className="btn btn-ghost text-xl normal-case">
                Settings
              </a>
            </>
          ) : (
            <a href="/" className="btn btn-ghost text-xl normal-case">
              Home
            </a>
          )}
        </div>
        <div className="navbar-end">
          {!sessionData && (
            <button
              className=" btn btn-outline btn-secondary mr-5 h-[1vh]"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          )}

          {sessionData && (
            <div className="dropdown dropdown-end dropdown-bottom dropdown-hover">
              <label tabIndex={0}>
                <div className="avatar placeholder">
                  <div className="bg-base-content text-neutral-content w-10 rounded-full">
                    <span className="text-xl text-black">
                      {sessionData?.user?.name?.[0]}
                    </span>
                  </div>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100  rounded-box z-[1] mt-4 w-44 shadow"
              >
                {sessionData ? (
                  <>
                    <li>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/library";
                        }}
                      >
                        {" "}
                        Home{" "}
                      </button>{" "}
                    </li>
                    <li>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/settings";
                        }}
                      >
                        {" "}
                        Settings{" "}
                      </button>{" "}
                    </li>
                  </>
                ) : (
                  <a href="/">Home</a>
                )}
                <li>
                  <button
                    className="bg-error"
                    onClick={async () => {
                      await signOut();
                      router.push("/").catch(console.error);
                    }}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Navbar };
