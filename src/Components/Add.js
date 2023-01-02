import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  InputNumber,
  Card,
  DatePicker,
  Spin,
  message,
  Tag,
} from "antd";
import LineItemsTable from "./LineItemsTable.js";
import { formatAmount } from "../data.js";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { endOfDay } from "date-fns";
import { MyContext } from "../App.js";

export default function Add({
  setAddModal,
  OnAddModal,
  loaderCall,
  isEdit = false,
  initialValues,
  mainIndex,
}) {
  const data = useContext(MyContext);
  const invoiceDetails = data[0];
  const updateInvoiceDetails = data[1];
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalLineItemAmount, setTotalLineItemAmount] = useState(0);
  const [rulesRequiered, setRulesRequired] = useState(true);
  const [lineItems, setLineItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [lFormValues, setlFormValues] = useState(null);
  const [form] = Form.useForm();
  const [lForm] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  let loaderTime = null;
  let payTime = null;

  const onLineItemsSubmit = async () => {
    const errors = await lForm.validateFields();
    if (!errors.errorFields) {
      setLoader(true);
      const values = lForm.getFieldsValue();
      setLineItems([
        ...lineItems,
        {
          lineItemId: Math.random(),
          lineItemName: values.lineItemName,
          labourName: values.labourName,
          hours: values.hours,
          amountPerHour: values.amountPerHour,
          totalLineItemAmount: values.hours * values.amountPerHour,
          notes: values.notes,
        },
      ]);
      lForm.resetFields();
      setTotalLineItemAmount(0);
      setLoader(false);
    }
  };

  const onAddInvoice = async (values) => {
    const errors = await lForm.validateFields();
    if (!errors.errorFields) {
      setLoader(true);
      let payload = {
        invoiceId: Math.random(),
        invoiceNumber: parseInt(invoiceDetails?.length + 1),
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerAddress: values.customerAddress,
        totalItems: lineItems?.length,
        totalAmount: totalAmount,
        remainingAmount: totalAmount,
        dueDate: moment(values.dueDate).format("DD/MM/YYYY"),
        paidDate: null,
        status: "unPaid",
        items: [...lineItems],
      };
      payload && updateInvoiceDetails(payload);
    }
    loaderTime = setTimeout(() => {
      setLoader(false);
      message.success("Invoice Added Successfully");
      setAddModal(false);
      loaderCall();
    }, 3000);
  };

  const handleChangeHour = (hour) => {
    const Rate = lForm.getFieldValue("amountPerHour");
    if (Rate) {
      let amount = Rate * hour;
      setTotalLineItemAmount(amount);
    }
  };

  const handleChangeRate = (rate) => {
    const hour = lForm.getFieldValue("hours");
    if (hour) {
      let amount = rate * hour;
      setTotalLineItemAmount(amount);
    }
  };

  const onClearForm = () => {
    form.resetFields();
    lForm.resetFields();
    setTotalLineItemAmount(0);
  };

  const onPayInvoice = () => {
    setLoader(true);
    let newArr =
      invoiceDetails &&
      invoiceDetails.map((item, index) => {
        if (mainIndex === index) {
          item.status = "paid";
          item.paidDate = moment().format("DD/MM/YYYY");
          item.remainingAmount = null;
        }
        return item;
      });
    updateInvoiceDetails(newArr);
    payTime = setTimeout(() => {
      setLoader(false);
      setAddModal(false);
      message.success("Invoice Paid Successfully");
    }, 2000);
  };

  useEffect(() => {
    if (isEdit && initialValues) {
      setlFormValues(initialValues.items);
    }
  }, [isEdit, initialValues]);

  useEffect(() => {
    return () => {
      clearTimeout(loaderTime);
      clearTimeout(payTime);
    };
  }, [OnAddModal]);

  useEffect(() => {
    if (lineItems?.length > 0) {
      setRulesRequired(false);
    } else {
      setRulesRequired(true);
    }
  }, [lineItems, rulesRequiered]);

  useEffect(() => {
    if (isEdit && lFormValues) {
      setLineItems(lFormValues);
    }
  }, [isEdit, lFormValues]);

  const renderTag = () => {
    if (initialValues) {
      if (initialValues.status === "paid") {
        return <Tag color="green">PAID</Tag>;
      } else if (initialValues.status === "unPaid") {
        return <Tag color="blue">UN-PAID</Tag>;
      } else {
        return <Tag color="red">LATE</Tag>;
      }
    }
  };

  return (
    <Spin spinning={loader}>
      <Form
        layout="vertical"
        form={form}
        name="addInvoiceForm"
        onFinish={onAddInvoice}
        initialValues={
          isEdit
            ? {
                customerName: initialValues.customerName,
                customerEmail: initialValues.customerEmail,
                customerAddress: initialValues.customerAddress,
              }
            : null
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item
              name="customerName"
              label="CUSTOMER NAME"
              rules={[{ required: true, message: "Please Enter Name" }]}
            >
              <Input
                placeholder="Customer Name"
                maxLength={20}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="customerEmail"
              label="CUSTOMER EMAIL"
              rules={[
                {
                  required: true,
                  message: "Please Enter Email",
                  type: "email",
                },
              ]}
            >
              <Input
                placeholder="Customer Email"
                maxLength={25}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="customerAddress"
              label="CUSTOMER ADDRESS"
              rules={[
                { required: true, message: "Please Enter Customer Address" },
              ]}
            >
              <Input
                placeholder="Customer Address"
                maxLength={40}
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={5}>
            <Form.Item name="totalAmount" label="TOTAL AMOUNT">
              &#8377; {formatAmount(totalAmount)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              name="dueDate"
              label="DUE DATE"
              rules={[{ required: true, message: "Please Select Duedate" }]}
            >
              {!isEdit ? (
                <DatePicker
                  style={{ width: "100%" }}
                  format={dateFormat}
                  disabledDate={
                    !isEdit ? (d) => d && d < endOfDay(new Date()) : null
                  }
                  disabled={isEdit}
                />
              ) : (
                <span className="dueDate">{initialValues["dueDate"]}</span>
              )}
            </Form.Item>
          </Col>
          {isEdit && initialValues["paidDate"] ? (
            <Col span={6}>
              <Form.Item name="paidDate" label="PAID DATE">
                <span className="dueDate">
                  <Tag color="green">{initialValues["paidDate"]}</Tag>
                </span>
              </Form.Item>
            </Col>
          ) : null}
          {isEdit ? (
            <Col span={4}>
              <Form.Item label="STATUS">{renderTag()}</Form.Item>
            </Col>
          ) : null}
        </Row>
        <Row justify={"start"}>
          <>
            <h3>Lineitems</h3>
          </>
        </Row>
        <Card>
          {!isEdit ? (
            <Form form={lForm} layout={"vertical"} name="lineItemsForm">
              <Row align="bottom" gutter={[16, 16]}>
                <Col span={6}>
                  <Form.Item
                    name="lineItemName"
                    label="LINEITEM NAME"
                    rules={
                      rulesRequiered
                        ? [
                            {
                              required: rulesRequiered,
                              message: "Please Enter Name",
                            },
                          ]
                        : []
                    }
                  >
                    <Input placeholder="Lineitem Name" maxLength={20} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="labourName"
                    label="LABOUR NAME"
                    rules={
                      rulesRequiered
                        ? [
                            {
                              required: rulesRequiered,
                              message: "Please Enter Labour Name",
                            },
                          ]
                        : []
                    }
                  >
                    <Input placeholder="Labour Name" maxLength={25} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="hours"
                    label="HOURS"
                    rules={
                      rulesRequiered
                        ? [
                            {
                              required: rulesRequiered,
                              message: "Please Enter Hours",
                            },
                          ]
                        : []
                    }
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="Hours"
                      maxLength={25}
                      onChange={handleChangeHour}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="amountPerHour"
                    label="RATE/HOUR"
                    rules={
                      rulesRequiered
                        ? [
                            {
                              required: rulesRequiered,
                              message: "Please Enter Rate/Hour",
                            },
                          ]
                        : []
                    }
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="Rate/Hour"
                      maxLength={25}
                      onChange={handleChangeRate}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="notes" label="NOTES">
                    <Input placeholder="Notes" maxLength={25} />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={6}>
                  <Form.Item name="totalAmount" label="TOTAL AMOUNT">
                    &#8377; {formatAmount(totalLineItemAmount)}
                  </Form.Item>
                </Col>
                <Col span={9}></Col>
                <Col span={2}>
                  <Form.Item label=" ">
                    <Button type="primary" onClick={onLineItemsSubmit}>
                      <PlusOutlined /> ADD
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : null}
          {lineItems?.length > 0 ? (
            <LineItemsTable
              dataSource={lineItems}
              setTotalAmount={setTotalAmount}
              setDataSource={setLineItems}
              isEdit={isEdit}
              totalAmount={totalAmount}
              initialValues={initialValues}
              onPayInvoice={onPayInvoice}
            />
          ) : null}
        </Card>
        {!isEdit ? (
          <Row justify={"end"} gutter={[24, 24]} className={"footerRow"}>
            <Col span={2}>
              <Button onClick={onClearForm}>CLEAR</Button>
            </Col>
            <Col span={2}>
              <Button htmlType="submit" type="primary">
                SUBMIT
              </Button>
            </Col>
          </Row>
        ) : null}
      </Form>
    </Spin>
  );
}
