import React, { useEffect, useState } from 'react';
import config from 'config';
import { Redirect } from 'react-router-dom';
import { Table, Layout } from 'antd';
// custom common components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// custom hook
import { useListCoins } from '../hooks';
const loading = require('../_helpers/loading.gif');
// helpers
import { authHeader, dynamicSort } from '../_helpers';
const { Content } = Layout;

export const Compare2 = (props) => {

  const [coins, toCoins] = useState([]);
  const [selectedCoins, setSelected] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [compared, toCompare] = useState([]);
  const [showCompare2, toShow] = useState(false);
  const [sleep, setSleep] = useState(null);
  const [dynaColumn, setDynaColumn] = useState([]);
  const fetched = useListCoins();
  
  const visibleFields = [
    {
      id: 0,
      label: "Coin Symbol",
      field: 'coin_symbol'
    },{
      id: 1,
      label: "Price",
      field: 'asset_price'
    },{
      id: 2,
      label: "All Time High",
      field: 'ath'
    },{
      id: 3,
      label: "All Time Low",
      field: 'atl'
    },{
      id: 4,
      label: "Buy Support 10%",
      field: 'buy_support'
    },{
      id: 5,
      label: "Sell Support 10%",
      field: 'sell_support'
    },{
      id: 6,
      label: "Price Change(24H)",
      field: 'asset_price_old'
    },{
      id: 7,
      label: "Volumn Change",
      field: 'volume_24'
    }
  ];
  
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
      key: '2'
    },
    {
      title: 'Coin Symbol',
      dataIndex: 'coin_symbol',
      key: '3'
    }
  ];

  let coinColumnsLong = [
    {
      title: 'Icon',
      dataIndex: 'img_url',
      key: '1',
      render: image => {
        const link = 'https://cryptocompare.com' + image;
        return <img src={loading} data-src={link} width="20" height="20" />;
      }
    },
    {
      title: 'Coin Name',
      dataIndex: 'coin_title',
      key: '2'
    },
    {
      title: 'Coin Symbol',
      dataIndex: 'coin_symbol',
      key: '3'
    },
    {
      title: 'Price',
      dataIndex: 'asset_price',
      key: '4'
    },
    {
      title: 'All Time High',
      dataIndex: 'ath',
      key: '5'
    },
    {
      title: 'All Time Low',
      dataIndex: 'atl',
      key: '6'
    },
    {
      title: 'Buy Support 10%',
      dataIndex: 'buy_support',
      key: '7',
      render: price => {
        return Number.parseInt(price) || 0
      }
    },
    {
      title: 'Sell Support 10%',
      dataIndex: 'sell_support',
      key: '8',
      render: price => {
        return Number.parseInt(price) || 0
      }
    },
    {
      title: 'Price Change (24H)',
      dataIndex: 'asset_price_old',
      key: '9',
      render: (price, row) => {
        return `${Number.parseInt(((row.asset_price - price) / row.asset_price)*100)}%`;
      }
    },
    {
      title: 'Volume Change',
      dataIndex: 'volume_24',
      key: '10',
      render: (volume, row) => {
        return `${Number.parseInt(((volume - row.volume_24_old) / volume)*100)}%`;
      }
    }
  ];

  const visibleFieldsColumn = [    
    {
      title: 'All Fields',
      dataIndex: 'label',
      key: '1'
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {      
      setSelected(selectedRows);
    },
    getCheckboxProps: record => ({
      name: record.name
    }),
  };

  const rowSelectionField = {
    onChange: (selectedRowKeys, selectedRows) => {      
      setSelectedFields(selectedRows);
    },
    getCheckboxProps: record => ({
      name: record.label
    }),
  };
  useEffect(() => {
    toCoins(fetched);    
    setTimeout(() => {
      const allimages = document.getElementsByTagName('img');
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
      }
    }, 1200);
    document.addEventListener('click', () => {
      const allimages = document.getElementsByTagName('img');
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
      }
    });
  }, [fetched]);

  useEffect(() => {
    if(sleep) clearTimeout(sleep);
    setSleep(setTimeout(() => {
      if(selectedCoins.length <= 1) return;
      const formatted = selectedCoins.map(s => s.coin_id);
      fetch(`${config.apiUrl}/get_assets_params`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ assets: formatted })
      }).then(response => response.json()).then(data => {        
        toCompare(data);
      });
    }, 500));
  }, [selectedCoins]);

  useEffect(() => {    
    if(compared.length > 1) {
      toShow(true);
      setTimeout(() => {
        const allimages = document.getElementsByTagName('img');
        for (let i = 0; i < allimages.length; i++) {
          if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
        }
      }, 1200);      
    }
    else toShow(false);
  }, [compared]);
  
  useEffect(() => {
    let replaces = [
      {
        title: 'Icon',
        dataIndex: 'img_url',
        key: '1',
        render: image => {
          const link = 'https://cryptocompare.com' + image;
          return <img src={loading} data-src={link} width="20" height="20" />;
        }
      },
      {
        title: 'Coin Name',
        dataIndex: 'coin_title',
        key: '2'
      }
    ];
    selectedFields.forEach(e => {
      replaces.push(...coinColumnsLong.filter(c => c.dataIndex === e.field));      
    });    
    setDynaColumn(replaces);    
  }, [selectedFields]);

  return (
    <div>
      <Layout>
        <Navigation activeNav="2" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280}}>
            <div className='tableGroup' style={{display:'flex', margin: '24px 16px', padding: 24, background: '#fff', justifyContent:'space-around'}}>
              <Table key={0} rowKey={coin => coin.coin_id} style={{ width: '40%' }} rowSelection={rowSelection} dataSource={coins.sort(dynamicSort('full_name'))} columns={coinColumnsShort} size="small" />
              <Table key={1} rowKey={field => field.id} dataSource={visibleFields} rowSelection={rowSelectionField} columns={visibleFieldsColumn} size="small" style={{ width: '40%' }}/>
            </div>
            <div>
              {showCompare2 && <Table key={3} pagination={false} rowKey={coin => coin.coin_id} dataSource={compared.sort(dynamicSort('full_name'))} columns={dynaColumn} /> }           
            </div>
          </Content>          
        </Layout>
      </Layout>
    </div>
  );
};
