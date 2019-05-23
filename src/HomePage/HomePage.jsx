import React, { useState, useEffect } from 'react';
// common custom components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// Layout
import { Layout, Table } from 'antd';
// custom hook
import { useListCoins } from '../hooks';
const loading = require('../_helpers/loading.gif');
// helpers
import { dynamicSort } from '../_helpers';
const { Content } = Layout;

export const HomePage = () => {

  const [coins, toCoins] = useState([]);

  const fetched = useListCoins();
  useEffect(() => {
    toCoins(fetched);
    setTimeout(() => {
      const allimages = document.getElementsByTagName('img');
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
      }
    }, 1200);
  }, [fetched]);

  const coinColumnsShort = [
    {
      title: 'Icon',
      dataIndex: 'img_url',
      key: '1',
      render: image => <img src={loading} data-src={image} width="20" height="20" />
    },
    {
      title: 'Coin Name',
      dataIndex: 'coin_title',
      key: '2',
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.coin_title.length - b.coin_title.length,
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Coin Symbol',
      dataIndex: 'coin_symbol',
      key: '3',
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.coin_title.length - b.coin_title.length,
      sortDirections: ['ascend', 'descend']
    }
  ];

  return (
    <div>
      <Layout>
        <Navigation activeNav="1" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Table rowKey={coin => coin.coin_id} pagination={false} dataSource={coins.sort(dynamicSort('full_name'))} columns={coinColumnsShort} size="small" />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
