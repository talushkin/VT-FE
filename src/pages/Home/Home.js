import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import PersonalizeLogoModel from "../../Models/PersonalizeLogoModel";
import { useHistory } from "react-router-dom";
import { PATH_SEARCH } from "../../Util/constants";
import SearchProperty from "../SearchProperty";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const Home = (props) => {
  const { agent, agency, token } = props;
  const history = useHistory();

  const [flag, setflag] = useState(true);
  const handleCloseModel = () => {
    setflag(false);
  };

  const isSearch = localStorage.getItem("isSearch");
  const doSearch = (page) => {
    if (isSearch) {
      console.log("first first first first");
      history.push(PATH_SEARCH);
    }
  };
  if (token === null) {
    history.push("/welcome");
  }

  return (
    <>
      <section className="homepage_section_cst">
        <PageHeader agency={agency} agent={agent} doSearch={doSearch} />
        {flag && agency?.userImage == "" && (
          <PersonalizeLogoModel
            agency={agency}
            agent={agent}
            doSearch={doSearch}
            handleCloseModel={handleCloseModel}
          />
        )}
      </section>
    </>
  );
};
export default Home;
