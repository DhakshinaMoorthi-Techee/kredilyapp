import React, { useEffect, useState } from "react";
import { Button, Row, Table, Typography, List } from "antd";
import { formatAmount } from "../data";
import { DeleteOutlined } from "@ant-design/icons";

export default function LineItemsTable({
  dataSource,
  setTotalAmount,
  setDataSource,
  totalAmount,
  isEdit = false,
  initialValues,
  onPayInvoice,
}) {
  const { Text } = Typography;
  const [status, setStatus] = useState(null);

  const onDeleteLineItem = (record) => {
    if (record) {
      let temp = [...dataSource];
      const index = temp.indexOf(record);
      temp.splice(index, 1);
      setDataSource([...temp]);
    }
  };

  const columns = [
    {
      title: "LineItem Name",
      dataIndex: "lineItemName",
      key: "lineItemName",
      width: 150,
      align: "center",
      render: (text, record) => {
        return (
          <>
            {isEdit ? (
              text
            ) : (
              <>
                <DeleteOutlined
                  style={{ color: "red", float: "left", cursor: "pointer" }}
                  onClick={onDeleteLineItem.bind(this, record)}
                />{" "}
                {text}
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Labour Name",
      dataIndex: "labourName",
      key: "labourName",
      width: 150,
      align: "center",
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: 150,
      align: "center",
    },
    {
      title: "Rate/Hour",
      dataIndex: "amountPerHour",
      key: "amountPerHour",
      width: 150,
      align: "center",
    },
    {
      title: "Total Rate",
      dataIndex: "totalLineItemAmount",
      key: "totalLineItemAmount",
      width: 150,
      align: "center",
    },
  ];

  const data = [
    "Use can pay the amount via UPIID : xyz@okhdfc.com",
    "Bank Name: United India, Bank Account No : 00000000",
    "Card is accepeted in all branch offices",
  ];

  useEffect(() => {
    if (isEdit && initialValues) {
      setStatus(initialValues.status);
    }
  }, [isEdit, initialValues]);

  const tableSummary = (record) => {
    let hours = 0;
    let ratePerHour = 0;
    let totalAmount = 0;
    record &&
      record.forEach((item) => {
        hours += item.hours;
        ratePerHour += item.amountPerHour;
        totalAmount += item.totalLineItemAmount;
      });
    setTotalAmount(totalAmount);

    return (
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={2} index={1} className={"tableData"}>
          <Text strong>{"TOTAL"}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} className={"tableData"}>
          <Text strong>{hours}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4} className={"tableData"}>
          <Text strong>{formatAmount(ratePerHour)}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5} className={"tableData"}>
          <Text strong>&#8377; {formatAmount(totalAmount)}</Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    );
  };
  return (
    <div>
      <Table
        rowKey={"lineItemId"}
        dataSource={dataSource}
        columns={columns}
        bordered
        summary={tableSummary}
        pagination={false}
      />
      {(isEdit && status === "unPaid") || status === "late" ? (
        <>
          <Row className="bottomRow" justify={"center"}>
            <span> CLICK HERE TO PAY THE AMOUNT</span>
          </Row>
          <Row className="bottomRowBtn" justify={"center"}>
            <Button onClick={onPayInvoice} type="primary">
              PAY : &#8377; {totalAmount}
            </Button>
          </Row>
        </>
      ) : null}
      {isEdit ? (
        <List
          header={<h3>PAYMENT METHODS</h3>}
          dataSource={data}
          renderItem={(item) => <List.Item>* {item}</List.Item>}
        />
      ) : null}
    </div>
  );
}
