import Content from "../../components/AdminContent/AdminContent";
import Layout from "../../components/Layout/AdminLayout";
import React from "react";

function AdminPage({ children }) {
  return (
    <div>
      <Layout>
        <Content />
      </Layout>
    </div>
  );
}

export default AdminPage;
