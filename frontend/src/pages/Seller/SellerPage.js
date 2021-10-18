import Content from "../../components/SellerContent/SellerContent";
import Layout from "../../components/Layout/SellerLayout";
import React from "react";

function SellerPage({ children }) {
  return (
    <div>
      <Layout>
        <Content />
      </Layout>
    </div>
  );
}

export default SellerPage;
