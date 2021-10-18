import Content from "../../components/ShipperContent/ShipperContent";
import Layout from "../../components/Layout/ShipperLayout";
import React from "react";

function ShipperPage({ children }) {
  return (
    <div>
      <Layout>
        <Content />
      </Layout>
    </div>
  );
}

export default ShipperPage;
