import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../App";
import {
  PageHeader,
  Button,
  Modal,
  Row,
  Col,
  Card,
  Spin,
  Form,
  Input,
  message,
  Tooltip,
} from "antd";
import "antd/dist/antd.css";
import Add from "./Add";
import { MailOutlined, PlusOutlined } from "@ant-design/icons";
import DashboardListView from "./DashboardListView";

export default function Main() {
  const data = useContext(MyContext);
  const invoiceDetails = data[0];
  const [onAddModal, setAddModal] = useState(false);
  const [onEditModal, setEditModal] = useState(false);
  const [onSendEmailModal, setSendEmailModal] = useState(false);
  const [listStatus, setListStatus] = useState("Late Invoices");
  const [dataSource, setDataSource] = useState([]);
  const [unPaidData, setUnpaidData] = useState([]);
  const [paidData, setPaidData] = useState([]);
  const [latePayData, setLatePayData] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [loader, setLoader] = useState(false);
  const [emailLoader, setEmailLoader] = useState(false);
  const [mainIndex, setMainIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [totalAmountValues, setTotalAmountValues] = useState({
    paid: 0,
    unPaid: 0,
    late: 0,
  });
  const [cardStyle, setCardStyle] = useState({
    boxShadow: "rgb(242, 7, 7) 0px 0px 5px 0px",
  });
  let loaderTime = null;

  const onAddInvoice = () => {
    setAddModal(true);
  };

  const onAddInvoiceClose = () => {
    setAddModal(false);
  };

  const onEditInvoiceClose = () => {
    setEditModal(false);
  };

  const onCardClick = (value) => {
    setListStatus(value);
  };

  const onEditInvoiceOpen = (record) => {
    let temp = [...invoiceDetails];
    const index = temp.indexOf(record);
    setMainIndex(index);
    setEditRecord(record);
    setEditModal(true);
  };

  const loaderCall = () => {
    setLoader(true);
    loaderTime = setTimeout(() => {
      setLoader(false);
      setListStatus("UnPaid Invoices");
    }, 2000);
  };

  const onSendEmail = () => {
    setEmailLoader(true);
    setTimeout(() => {
      setEmailLoader(false);
      setSendEmailModal(false);
      message.success("Email Send Successfully");
      setSelectedRow([]);
    }, 2000);
  };

  useEffect(() => {
    setUnpaidData(
      invoiceDetails &&
        invoiceDetails.filter((item) => item.status === "unPaid")
    );
    setPaidData(
      invoiceDetails && invoiceDetails.filter((item) => item.status === "paid")
    );
    setLatePayData(
      invoiceDetails && invoiceDetails.filter((item) => item.status === "late")
    );
  }, [invoiceDetails]);

  useEffect(() => {
    if (listStatus === "Late Invoices") {
      setDataSource(latePayData);
      setCardStyle({ boxShadow: "rgb(242, 7, 7) 0px 0px 5px 0px" });
    } else if (listStatus === "UnPaid Invoices") {
      setDataSource(unPaidData);
      setCardStyle({ boxShadow: "rgb(36, 80, 255) 0px 0px 5px 0px" });
    } else {
      setDataSource(paidData);
      setCardStyle({ boxShadow: "rgb(2, 209, 71) 0px 0px 5px 0px" });
    }
    let paidAmount = 0;
    let unPaidAmount = 0;
    let lateAmount = 0;
    paidData.forEach((item) => {
      paidAmount += item.totalAmount;
    });
    unPaidData.forEach((item) => {
      unPaidAmount += item.totalAmount;
    });
    latePayData.forEach((item) => {
      lateAmount += item.totalAmount;
    });
    setTotalAmountValues({
      paid: paidAmount,
      unPaid: unPaidAmount,
      late: lateAmount,
    });
    return () => clearTimeout(loaderTime);
  }, [listStatus, latePayData, unPaidData, paidData]);

  const renderEditHeader = () => {
    return (
      <>
        <Row>
          <h2>View Invoice</h2>
        </Row>
      </>
    );
  };

  const renderColumn = (title, color, count, amount) => {
    return (
      <Col
        lg={6}
        xs={12}
        className={"dashboardCard"}
        onClick={onCardClick.bind(this, title)}
        style={{
          borderRadius: "9px",
          border: `2px solid ${color}`,
          borderLeft: `10px solid ${color}`,
          marginBottom: 10,
          padding: "5px",
        }}
      >
        <Row justify="space-between" className="pv1">
          <Col style={{ fontSize: 14, color: "#666666", fontWeight: "bolder" }}>
            {title}
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8} style={{ color: color, fontWeight: "bolder" }}>
            {count ? count : 0}
          </Col>
          <Col
            span={16}
            style={{ color: color, fontWeight: "bolder", textAlign: "end" }}
          >
            &#8377; {amount}
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <Spin spinning={loader}>
      <PageHeader
        title={<h1>Invoice Details</h1>}
        ghost
        extra={[
          selectedRow.length == 0 ? (
            <Tooltip title="Please Select The Invoice">
              <Button
                onClick={() => setSendEmailModal(true)}
                type="dashed"
                disabled={selectedRow.length == 0}
              >
                <MailOutlined /> SEND EMAIL
              </Button>
            </Tooltip>
          ) : (
            <Button
              onClick={() => setSendEmailModal(true)}
              type="dashed"
              disabled={selectedRow.length == 0}
            >
              <MailOutlined /> SEND EMAIL
            </Button>
          ),
          <Button onClick={onAddInvoice} type="primary">
            <PlusOutlined /> ADD INVOICE
          </Button>,
        ]}
      >
        <Row justify={"space-around"} className={"dashboardRow"}>
          {renderColumn(
            "Late Invoices",
            "red",
            latePayData.length,
            totalAmountValues.late
          )}
          {renderColumn(
            "UnPaid Invoices",
            "blue",
            unPaidData.length,
            totalAmountValues.unPaid
          )}
          {renderColumn(
            "Paid Invoices",
            "green",
            paidData.length,
            totalAmountValues.paid
          )}
        </Row>
        <Card style={cardStyle} className={"listViewCard"}>
          <PageHeader title={<p>{listStatus}</p>}>
            <DashboardListView
              dataSource={dataSource}
              onEditInvoiceOpen={onEditInvoiceOpen}
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
            />
          </PageHeader>
        </Card>
      </PageHeader>
      <Modal
        width={"90%"}
        title={<h2>Add Invoice</h2>}
        open={onAddModal}
        onCancel={onAddInvoiceClose}
        destroyOnClose
        footer={false}
      >
        <Add
          setAddModal={setAddModal}
          onAddModal={onAddModal}
          loaderCall={loaderCall}
        />
      </Modal>
      <Modal
        width={"90%"}
        title={renderEditHeader()}
        open={onEditModal}
        onCancel={onEditInvoiceClose}
        destroyOnClose
        footer={false}
      >
        <Add
          setAddModal={setEditModal}
          onAddModal={onEditModal}
          isEdit={true}
          initialValues={editRecord}
          mainIndex={mainIndex}
        />
      </Modal>
      <Modal
        width={"25%"}
        title={"SEND EMAIL"}
        open={onSendEmailModal}
        onCancel={() => setSendEmailModal(false)}
        destroyOnClose
        footer={false}
      >
        <Spin spinning={emailLoader}>
          <Form onFinish={onSendEmail} layout={"vertical"}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="TO EMAIL"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Email",
                      type: "email",
                    },
                  ]}
                >
                  <Input placeholder="Email" maxLength={25} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Button htmlType="submit" type="primary">
                SEND
              </Button>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </Spin>
  );
}
