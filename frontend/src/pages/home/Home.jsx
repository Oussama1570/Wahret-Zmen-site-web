import React from "react";
import { useTranslation } from "react-i18next";
import Banner from "./Banner";
import TopSellers from "./TopSellers";
import News from "./News";
import { Helmet } from "react-helmet"; // Importing Helmet

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Set the title for the Home Page */}
      <Helmet>
        <title>Wahret Zmen - Traditional Clothing and Top Sellers</title> {/* Updated Title */}
        <meta
          name="description"
          content="Welcome to Wahret Zmen, explore our top-selling traditional clothing, new arrivals, and the latest trends in fashion."
        />
      </Helmet>

      <h1 className="text-center text-2xl font-bold">{t("home")}</h1>
      <Banner />
      <TopSellers />
      <News />
    </>
  );
};

export default Home;

