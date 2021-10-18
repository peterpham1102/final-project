import Content from "../../components/BuyerContent/BuyerContent";
import Layout from "../../components/Layout/BuyerLayout";
import React from "react";

function BuyerPage({ children }) {
  return (
    <div>
      <Layout>
        <Content />
      </Layout>
    </div>
  );
}

export default BuyerPage;
