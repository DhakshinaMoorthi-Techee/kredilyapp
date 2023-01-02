import { Table, Tag } from "antd";
import React from "react";
import { formatAmount } from "../data";

export default function DashboardListView({ dataSource, onEditInvoiceOpen }) {
  const onSelectRow = (record, index) => {
    onEditInvoiceOpen(record, index);
  };
  const columns = [
    {
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 150,
      align: "center",
      render: (text, record) => {
        return <a>{text}</a>;
      },
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      align: "center",
    },
    {
      title: "CUSTOMER EMAIL",
      dataIndex: "customerEmail",
      key: "customerEmail",
      width: 150,
      align: "center",
    },
    {
      title: "CUSTOMER ADDRESS",
      dataIndex: "customerAddress",
      key: "customerAddress",
      width: 150,
      align: "center",
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 150,
      align: "center",
    },
    {
      title: "PAID DATE",
      dataIndex: "paidDate",
      key: "paidDate",
      width: 150,
      align: "center",
      render: (text) => {
        return <> {text ? text : "-"}</>;
      },
    },
    {
      title: "TOTAL LINE ITEMS",
      dataIndex: "totalItems",
      key: "totalItems",
      width: 150,
      align: "center",
    },
    {
      title: "TOTAL INVOICE AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      align: "center",
      render: (text) => {
        return <>&#8377; {formatAmount(text)}</>;
      },
    },
    {
      title: "REMAINING AMOUNT",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      width: 150,
      align: "center",
      render: (text) => {
        return <> {text ? <span>&#8377; {formatAmount(text)}</span> : "-"}</>;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      render: (text) => {
        if (text === "paid") {
          return <Tag color="green">PAID</Tag>;
        } else if (text === "unPaid") {
          return <Tag color="blue">UN-PAID</Tag>;
        } else {
          return <Tag color="red">LATE</Tag>;
        }
      },
    },
  ];
  return (
    <div>
      <Table
        className="listTable"
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              onSelectRow(record);
            },
          };
        }}
        rowClassName={"tableRow"}
      />
    </div>
  );
}
