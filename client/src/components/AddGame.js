import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";

export default function AddGame() {
  const [openFormModal, setOpenFormModal] = useState(false);

  // antd code
  const showModal = () => {
    setOpenFormModal(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpenFormModal(false);
    }, 1000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenFormModal(false);
  };

  const [form] = Form.useForm();

  // Once the form is submitted, the data is sent to the server
  const onFinish = async (e) => {
    try {
      // send a POST request to the server with the form data
      const response = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: parseInt(e.rank),
          name: e.name,
          platform: e.platform,
          year: parseInt(e.year),
          genre: e.genre,
          publisher: e.publisher,
          na_sales: parseFloat(e.na_sales),
          eu_sales: parseFloat(e.eu_sales),
          jp_sales: parseFloat(e.jp_sales),
          other_sales: parseFloat(e.other_sales),
          global_sales: parseFloat(e.global_sales),
        }),
      });

      handleOk();
      form.resetFields();
      // display a success / error message
      response.status === 200 && message.success("Game added successfully");
      response.status === 400 && message.error("Error adding game");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* Button for opening form modal */}
      <Button
        type="primary"
        size={"large"}
        style={{
          fontWeight: "600",
          float: "right",
          marginBottom: "20px",
        }}
        onClick={showModal}
      >
        Add game
      </Button>

      {/* Modal with a Form inside */}
      <Modal
        title="Add game"
        open={openFormModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout={"horizontal"} form={form} onFinish={onFinish}>
          <Form.Item
            label="Rank"
            name="rank"
            rules={[
              {
                required: true,
                message: "Please input the rank!",
              },
            ]}
          >
            <Input placeholder="" type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label="Platform"
            name="platform"
            rules={[
              {
                required: true,
                message: "Please input the platform!",
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[
              {
                required: true,
                message: "Please input the year!",
              },
            ]}
          >
            <Input placeholder="" type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Genre"
            name="genre"
            rules={[
              {
                required: true,
                message: "Please input the genre!",
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label="Publisher"
            name="publisher"
            rules={[
              {
                required: true,
                message: "Please input the publisher!",
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label="NA_Sales"
            name="na_sales"
            rules={[
              {
                required: true,
                message: "Please input na_sales!",
              },
            ]}
          >
            <Input placeholder="" type="float" min={0} />
          </Form.Item>
          <Form.Item
            label="EU_Sales"
            name="eu_sales"
            rules={[
              {
                required: true,
                message: "Please input eu_sales!",
              },
            ]}
          >
            <Input placeholder="" type="float" min={0} />
          </Form.Item>
          <Form.Item
            label="JP_Sales"
            name="jp_sales"
            rules={[
              {
                required: true,
                message: "Please input jp_sales!",
              },
            ]}
          >
            <Input placeholder="" type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Other_Sales"
            name="other_sales"
            rules={[
              {
                required: true,
                message: "Please input other_sales!",
              },
            ]}
          >
            <Input placeholder="" type="float" min={0} />
          </Form.Item>
          <Form.Item
            label="Global_Sales"
            name="global_sales"
            rules={[
              {
                required: true,
                message: "Please input global_sales!",
              },
            ]}
          >
            <Input placeholder="" type="float" min={0} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size={"medium"}
              style={{ float: "right" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
