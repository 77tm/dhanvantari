import React, { useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Modal, Card, Form, message } from "antd";

export default function GameCard({
  // props
  selectedGameRecord,
  isModalOpen,
  handleOk,
  handleCancel,
  reviewData,
  isEditReviewOpen,
  selectedReview,
}) {
  const data = reviewData;

  const [editForm, setEditForm] = useState(false);
  const [reviewForm, setReviewForm] = useState(false);

  const showForm = () => {
    setEditForm(true);
  };
  const showReviewForm = () => {
    setReviewForm(true);
  };

  const [form] = Form.useForm();

  // function to edit game info in the database
  const onFinishGame = async (e) => {
    try {
      const response = await fetch(`http://localhost:4000/${e.rank}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // get the values from the form and send them to the server
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
      console.log(response);
      form.resetFields();
      response.status === 200 && message.success("Game edited successfully");
      response.status === 400 && message.error("Error editing game");
    } catch (err) {
      console.error(err.message);
    }
    setTimeout(() => {
      window.location.reload(false);
    }, 2000);
    setEditForm(false);
  };

  // function to add a new review to the database
  const onFinishReview = async (e) => {
    console.log(e);
    try {
      const response = await fetch(`http://localhost:4000/add-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: parseInt(e.app_id),
          app_name: e.app_name,
          review_text: e.review_text,
          review_score: parseFloat(e.review_score),
          review_votes: parseInt(e.review_votes),
        }),
      });
      console.log(response);
      form.resetFields();
      response.status === 200 && message.success("Review added successfully");
      response.status === 400 && message.error("Error adding review");
    } catch (err) {
      console.error(err.message);
    }
    setTimeout(() => {
      window.location.reload(false);
    }, 2000);
    setEditForm(false);
  };

  // function to edit a review in the database
  const onFinishReviewEdit = async (e) => {
    console.log(e);
    try {
      const response = await fetch(
        `http://localhost:4000/edit-review/${e.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: parseInt(e.id),
            app_id: parseInt(e.app_id),
            app_name: e.app_name,
            review_text: e.review_text,
            review_score: parseFloat(e.review_score),
            review_votes: parseInt(e.review_votes),
          }),
        }
      );
      console.log(response);
      form.resetFields();
      response.status === 200 &&
        message.success("Review edited successfully, refresh to see changes");
      response.status === 400 && message.error("Error editing review");
    } catch (err) {
      console.error(err.message);
    }
  };

  // antd code
  const handleFormCancel = () => {
    handleCancel();
    form.resetFields();
    setEditForm(false);
    setReviewForm(false);
  };

  const handleFormOk = () => {
    handleOk();
    form.resetFields();
    setEditForm(false);
    setReviewForm(false);
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Review",
      dataIndex: "review_text",
      key: "review_text",
      ...getColumnSearchProps("review_text"),
      sorter: (a, b) => a.review_text.length - b.review_text.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  return (
    // Modal to display the game card
    <Modal
      open={isModalOpen}
      onOk={handleFormOk}
      onCancel={handleFormCancel}
      width={1200}
    >
      {/* if game info edit form is open */}
      {editForm ? (
        <div>
          <Form layout={"horizontal"} form={form} onFinish={onFinishGame}>
            <Form.Item
              label="Rank"
              name="rank"
              initialValue={selectedGameRecord.rank}
            >
              <Input placeholder="" disabled />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              initialValue={selectedGameRecord.name}
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
              initialValue={selectedGameRecord.platform}
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
              initialValue={selectedGameRecord.year}
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
              initialValue={selectedGameRecord.genre}
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
              initialValue={selectedGameRecord.publisher}
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
              initialValue={selectedGameRecord.na_sales}
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
              initialValue={selectedGameRecord.eu_sales}
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
              initialValue={selectedGameRecord.jp_sales}
              rules={[
                {
                  required: true,
                  message: "Please input jp_sales!",
                },
              ]}
            >
              <Input placeholder="" type="float" min={0} />
            </Form.Item>
            <Form.Item
              label="Other_Sales"
              name="other_sales"
              initialValue={selectedGameRecord.other_sales}
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
              initialValue={selectedGameRecord.global_sales}
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
        </div>
      ) : //   if add new review form is open
      reviewForm ? (
        <div>
          <Form layout={"horizontal"} form={form} onFinish={onFinishReview}>
            <Form.Item
              label="App id"
              name="app_id"
              rules={[
                {
                  required: true,
                  message: "Please input the app_id!",
                },
              ]}
            >
              <Input placeholder="" type="number" min={0} />
            </Form.Item>
            <Form.Item
              label="App name"
              name="app_name"
              initialValue={selectedGameRecord.name}
              rules={[
                {
                  required: true,
                  message: "Please input the app_name!",
                },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="Review text"
              name="review_text"
              rules={[
                {
                  required: true,
                  message: "Please input the review_text!",
                },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="Review score"
              name="review_score"
              rules={[
                {
                  required: true,
                  message: "Please input the review_score!",
                },
              ]}
            >
              <Input placeholder="" type="float" min={0} />
            </Form.Item>
            <Form.Item
              label="Review votes"
              name="review_votes"
              rules={[
                {
                  required: true,
                  message: "Please input the review_votes!",
                },
              ]}
            >
              <Input placeholder="" type="number" min={0} />
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
        </div>
      ) : //   if edit review form is open
      isEditReviewOpen ? (
        <div>
          <Form layout={"horizontal"} form={form} onFinish={onFinishReviewEdit}>
            <Form.Item
              label="Review id"
              name="id"
              initialValue={selectedReview.id}
            >
              <Input placeholder="" disabled />
            </Form.Item>
            <Form.Item
              label="App id"
              name="app_id"
              initialValue={selectedReview.app_id}
              rules={[
                {
                  required: true,
                  message: "Please input the app_id!",
                },
              ]}
            >
              <Input placeholder="" type="number" min={0} />
            </Form.Item>
            <Form.Item
              label="App name"
              name="app_name"
              initialValue={selectedReview.app_name}
              rules={[
                {
                  required: true,
                  message: "Please input the app_name!",
                },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="Review text"
              name="review_text"
              initialValue={selectedReview.review_text}
              rules={[
                {
                  required: true,
                  message: "Please input the review_text!",
                },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="Review score"
              name="review_score"
              initialValue={selectedReview.review_score}
              rules={[
                {
                  required: true,
                  message: "Please input the review_score!",
                },
              ]}
            >
              <Input placeholder="" type="number" min={0} />
            </Form.Item>
            <Form.Item
              label="Review votes"
              name="review_votes"
              initialValue={selectedReview.review_votes}
              rules={[
                {
                  required: true,
                  message: "Please input the review_votes!",
                },
              ]}
            >
              <Input placeholder="" type="number" min={0} />
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
        </div>
      ) : (
        //  if none of the forms are open
        <div>
          {/* Card displaying game info */}
          <Card
            title={selectedGameRecord.name}
            style={{
              width: 600,
              marginBottom: 20,
              margin: "auto",
            }}
          >
            <p>Rank: {selectedGameRecord.rank}</p>
            <p>Platform: {selectedGameRecord.platform}</p>
            <p>Year: {selectedGameRecord.year}</p>
            <p>Genre: {selectedGameRecord.genre}</p>
            <p>Publisher: {selectedGameRecord.publisher}</p>
            <p>NA Sales: {selectedGameRecord.na_sales}</p>
            <p>EU Sales: {selectedGameRecord.eu_sales}</p>
            <p>JP Sales: {selectedGameRecord.jp_sales}</p>
            <p>Other Sales: {selectedGameRecord.other_sales}</p>
            <p>Global Sales: {selectedGameRecord.global_sales}</p>
            <p>Review Count: {selectedGameRecord.review_count}</p>

            <Button block type="primary" onClick={showForm}>
              Edit Game info
            </Button>
          </Card>
          <Button
            type="primary"
            style={{ float: "right", marginBottom: 10 }}
            onClick={showReviewForm}
          >
            Add review
          </Button>
          <Table columns={columns} dataSource={data} />
        </div>
      )}
    </Modal>
  );
}
