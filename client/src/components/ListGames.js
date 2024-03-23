import React, { useRef, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import GameCard from "./GameCard";

export default function ListGames() {
  const [games, setGames] = useState([]);
  const [selectedGameRecord, setselectedGameRecord] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setselectedGameRecord({});
    setIsModalOpen(false);
  };

  // function to fetch games from db
  const getGames = async () => {
    try {
      const response = await fetch("http://localhost:4000/");
      const games = await response.json();
      // set games state
      setGames(games);

      // map through games
      games.map((games) => {
        return {
          key: games.rank,
          rank: games.rank,
          name: games.name,
          platform: games.platform,
          year: games.year,
          genre: games.genre,
          publisher: games.publisher,
          na_sales: games.na_sales,
          eu_sales: games.eu_sales,
          jp_sales: games.jp_sales,
          other_sales: games.other_sales,
          global_sales: games.global_sales,
          review_count: games.review_count,
        };
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  // function to open game card modal
  const handleRowClick = (record) => {
    setIsModalOpen(true);
    setselectedGameRecord(record);
  };

  // fetch games on component mount as soon as it renders
  useEffect(() => {
    getGames();
    console.log("Games fetched!");
  }, []);

  // antd code
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
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: "10%",
      ...getColumnSearchProps("rank"),
      sorter: (a, b) => a.rank - b.rank,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      ...getColumnSearchProps("platform"),
      sorter: (a, b) => a.platform.localeCompare(b.platform),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      ...getColumnSearchProps("year"),
      sorter: (a, b) => a.year - b.year,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      ...getColumnSearchProps("genre"),
      sorter: (a, b) => a.genre.localeCompare(b.genre),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      key: "publisher",
      ...getColumnSearchProps("publisher"),
      sorter: (a, b) => a.publisher.localeCompare(b.publisher),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "NA_Sales",
      dataIndex: "na_sales",
      key: "na_sales",
      ...getColumnSearchProps("na_sales"),
      sorter: (a, b) => a.na_sales - b.na_sales,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "EU_Sales",
      dataIndex: "eu_sales",
      key: "eu_sales",
      ...getColumnSearchProps("eu_sales"),
      sorter: (a, b) => a.eu_sales - b.eu_sales,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "JP_Sales",
      dataIndex: "jp_sales",
      key: "jp_sales",
      ...getColumnSearchProps("jp_sales"),
      sorter: (a, b) => a.jp_sales - b.jp_sales,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Other_Sales",
      dataIndex: "other_sales",
      key: "other_sales",
      ...getColumnSearchProps("other_sales"),
      sorter: (a, b) => a.other_sales - b.other_sales,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Global_Sales",
      dataIndex: "global_sales",
      key: "global_sales",
      ...getColumnSearchProps("global_sales"),
      sorter: (a, b) => a.global_sales - b.global_sales,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Review_Count",
      dataIndex: "review_count",
      key: "review_count",
      ...getColumnSearchProps("review_count"),
      sorter: (a, b) => a.review_count - b.review_count,
      sortDirections: ["descend", "ascend"],
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Game list</h1>
      <Table
        columns={columns}
        dataSource={games}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        style={{ cursor: "pointer" }}
      />
      {/* Pass needed props to GameCard component */}
      <GameCard
        selectedGameRecord={selectedGameRecord}
        isModalOpen={isModalOpen}
        handleClose={handleModalClose}
      />
    </>
  );
}
