import React, { useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import NotFoundImage from "../images/404-illustration.svg";
import { connect } from "react-redux";
import routes from "../routes";

function PageNotFound(props) {
  const {
    auth: { user },
  } = props;
  const navigate = useNavigate();

  const Home = useCallback(() => {
    user
      ? navigate(routes.dashboard, { replace: true })
      : navigate(routes.logon, { replace: true });
  },[navigate, user]);

  useEffect(()=>{
    Home();
  },[Home, user]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
          {/* <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> */}
            <div className="max-w-2xl m-auto mt-16">
              <div className="text-center px-4">
                <div className="inline-flex mb-8">
                  <img
                    src={NotFoundImage}
                    width="176"
                    height="176"
                    alt="404 illustration"
                  />
                </div>
                <div className="mb-6">
                  Hmm...this page doesn’t exist.
                </div>
                <Link
                  onClick={Home}
                  className="btn bg-blue-800 hover:bg-blue-900 hover:text-white text-white"
                >
                  Go Back 
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps) (PageNotFound);
