import React, { useEffect, useState, useRef } from 'react';
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

const visibleFieldsDataColumn = [
  {
    title: 'All Fields',
    dataIndex: 'name'
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
const coinColumnsLong = [
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
    title: 'Asset name',
    dataIndex: 'coin_title',
    key: '2'
  },
  {
    title: 'TA score',
    dataIndex: 'coin_ta_final',
    key: '3'
  },
  {
    title: 'Token supply',
    dataIndex: 'supply',
    key: '4'
  },
  {
    title: 'Marketcap',
    dataIndex: 'market_cap_usd',
    key: '5'
  },
  {
    title: 'Price USD',
    dataIndex: 'close_usd',
    key: '6'
  },
  {
    title: 'Price change USD (24h)',
    dataIndex: 'day_usd_change',
    key: '7'
  },
  {
    title: 'Volume 24h USD',
    dataIndex: 'vol_usd',
    key: '8'
  },
  {
    title: 'Volume change (24h)',
    dataIndex: 'day_vol_change',
    key: '9'
  },
  {
    title: 'Twitter list',
    dataIndex: 'tw_lists',
    key: '10'
  },
  {
    title: 'Twitter favorites',
    dataIndex: 'tw_fav',
    key: '11'
  },
  {
    title: 'Twitter following',
    dataIndex: 'tw_following',
    key: '12'
  },
  {
    title: 'Twitter status',
    dataIndex: 'tw_statuses',
    key: '13'
  },
  {
    title: 'Twitter followers',
    dataIndex: 'tw_followers',
    key: '14'
  },
  {
    title: 'Reddit active users',
    dataIndex: 'red_active_users',
    key: '15'
  },
  {
    title: 'Reddit posts',
    dataIndex: 'red_post_avg',
    key: '16'
  },
  {
    title: 'Reddit comments',
    dataIndex: 'red_comment_avg',
    key: '17'
  },
  {
    title: 'Reddit subscribers',
    dataIndex: 'red_subs',
    key: '18'
  },
  {
    title: 'Github Closed issues',
    dataIndex: 'code_rep_closed_issues',
    key: '19'
  },
  {
    title: 'Github Open pull issues',
    dataIndex: 'code_rep_open_pull_issues',
    key: '20'
  },
  {
    title: 'Github Closed pull issues',
    dataIndex: 'code_rep_closed_pull_issues',
    key: '21'
  },
  {
    title: 'Github Forks',
    dataIndex: 'code_rep_forks',
    key: '22'
  },
  {
    title: 'Marketcap',
    dataIndex: 'market_cap_usd',
    key: '23'
  },
  {
    title: 'Github Subscribers',
    dataIndex: 'code_rep_subscribers',
    key: '24'
  },
  {
    title: 'Github',
    dataIndex: 'code_rep_stars',
    key: '25'
  },
  {
    title: 'Volatilty 30 day (USD)',
    dataIndex: 'volatilty_30_usd',
    key: '26'
  },
  {
    title: 'Volatilty 60 days (USD)',
    dataIndex: 'volatilty_60_usd',
    key: '27'
  },
  {
    title: 'Volatilty 120 days (USD)',
    dataIndex: 'volatilty_120_usd',
    key: '28'
  },
  {
    title: 'Volatilty 1 year (USD)',
    dataIndex: 'volatilty_year_usd',
    key: '29'
  },
  {
    title: 'ATH (USD)',
    dataIndex: 'usd_ath',
    key: '30'
  },
  {
    title: 'Days since ATH (USD)',
    dataIndex: 'days_ath_usd',
    key: '31'
  },
  {
    title: 'Current Price/ATH (USD)',
    dataIndex: 'current_div_ath_usd',
    key: '32'
  },
  {
    title: 'ATL (USD)',
    dataIndex: 'usd_atl',
    key: '33'
  },
  {
    title: 'Days since ATL (USD)',
    dataIndex: 'days_atl_usd',
    key: '34'
  },
  {
    title: 'ATL/Current Price (USD)',
    dataIndex: 'atl_div_current_usd',
    key: '35'
  },
  {
    title: 'Weekly Price change % (USD)',
    dataIndex: 'week_usd_change',
    key: '36'
  },
  {
    title: 'Mayer Multiple (USD)',
    dataIndex: 'mayer_multiple_usd',
    key: '37'
  },
  {
    title: '30 days ratio (USD) Last 30d price avg / Past 30d price avg',
    dataIndex: 'last30_div_past30_usd',
    key: '38'
  },
  {
    title: '60 days ratio (USD) Last 60d price avg / Past 60d price avg',
    dataIndex: 'last60_div_past60_usd',
    key: '39'
  },
  {
    title: '120 days ratio (USD) Last 120d price avg / Past 120d price avg',
    dataIndex: 'last120_div_past120_usd',
    key: '40'
  },
  {
    title: '1 year ratio (USD) Last year price avg / Past year price avg',
    dataIndex: 'lastyear_div_pastyear_usd',
    key: '41'
  },
  {
    title: 'Buy Support 1%',
    dataIndex: 'buy_support_1',
    key: '42'
  },
  {
    title: 'Buy Support 2%',
    dataIndex: 'buy_support_2',
    key: '43'
  },
  {
    title: 'Buy Support 3%',
    dataIndex: 'buy_support_3',
    key: '44'
  },
  {
    title: 'Buy Support 4%',
    dataIndex: 'buy_support_4',
    key: '45'
  },
  {
    title: 'Buy Support 5%',
    dataIndex: 'buy_support_5',
    key: '46'
  },
  {
    title: 'Buy Support 10%',
    dataIndex: 'buy_support_10',
    key: '47'
  },
  {
    title: 'Buy Support 15%',
    dataIndex: 'buy_support_15',
    key: '48'
  },
  {
    title: 'Sell Support 1%',
    dataIndex: 'sell_support_1',
    key: '49'
  },
  {
    title: 'Sell Support 2%',
    dataIndex: 'sell_support_2',
    key: '50'
  },
  {
    title: 'Sell Support 3%',
    dataIndex: 'sell_support_3',
    key: '51'
  },
  {
    title: 'Sell Support 4%',
    dataIndex: 'sell_support_4',
    key: '52'
  },
  {
    title: 'Sell Support 5%',
    dataIndex: 'sell_support_5',
    key: '53'
  },
  {
    title: 'Sell Support 10%',
    dataIndex: 'sell_support_10',
    key: '54'
  },
  {
    title: 'Sell Support 15%',
    dataIndex: 'sell_support_15',
    key: '55'
  },
  {
    title: 'Buy 10%/Sell 10%',
    dataIndex: 'buy_div_sell_10',
    key: '56'
  },
  {
    title: 'Buy 5%/Sell 5%',
    dataIndex: 'buy_div_sell_5',
    key: '57'
  },
  {
    title: 'Buy Support 10% / Market cap',
    dataIndex: 'buy_10_div_mcap',
    key: '58'
  },
  {
    title: '(Buy 10%/Sell 10%)^2 * (Buy 10%/Market cap)',
    dataIndex: 'amir_liquidity_metric',
    key: '59'
  },
  {
    title: '(Buy 10%-Sell 10%) / (Buy 10%+Sell 10%)',
    dataIndex: 'andrey_liquidity_metric',
    key: '60'
  }
];


export const Compare2 = (props) => {

  const SHOW_LIMIT = 14;

  const [coins, toCoins] = useState([]);
  const [selectedCoins, setSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [compared, toCompare] = useState([]);
  const [showCompare2, toShow] = useState(false);
  const [sleep, setSleep] = useState(null);
  const [dynaColumn, setDynaColumn] = useState([]);
  const prevFields = useRef();
  const fetched = useListCoins();

  const getVisibleFieldsData = (columns) => {
    let datas = [];
    columns.map((e, i) => {
      if (i > 1) {//except for icon and coin name
        datas.push({
          key: i - 2,
          name: e.title,
          field: e.dataIndex
        })
      }
    });
    return datas;
  }
  const visibleFieldsData = getVisibleFieldsData(coinColumnsLong);

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
    if (sleep) clearTimeout(sleep);
    setSleep(setTimeout(() => {
      if (selectedCoins.length <= 1) return;
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
    if (compared.length > 1) {
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

    selectedRowKeys.forEach(e => {
      let row = visibleFieldsData.filter(p => p.key === e)[0];
      replaces.push(...coinColumnsLong.filter(c => c.dataIndex === row.field));
    });
    setDynaColumn(replaces);
  }, [selectedRowKeys]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelected(selectedRows);
    },
    getCheckboxProps: record => ({
      name: record.name
    }),
  };
  const rowSelectionField = {
    selectedRowKeys,
    onChange: selectRowKeys => {
      if (selectRowKeys.length <= SHOW_LIMIT) {
        setSelectedRowKeys(selectRowKeys);
        prevFields.current = selectRowKeys;
      } else {
        setSelectedRowKeys(prevFields.current);
      }
    }
  };
  return (
    <div>
      <Layout>
        <Navigation activeNav="2" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <div className='tableGroup' style={{ display: 'flex', margin: '24px 16px', padding: 24, background: '#fff', justifyContent: 'space-around' }}>
              <Table key={0} rowKey={coin => coin.coin_id} style={{ width: '40%' }} rowSelection={rowSelection} dataSource={coins.sort(dynamicSort('full_name'))} columns={coinColumnsShort} size="small" />
              <Table key={1} rowKey={vfield => vfield.key} pagination={false} scroll={{ y: 400 }} title={() => 'Parameters'} showHeader={false} rowSelection={rowSelectionField} columns={visibleFieldsDataColumn} dataSource={visibleFieldsData} size="small" style={{ width: '40%' }} />
            </div>
            <div>
              {showCompare2 && <Table key={3} pagination={false} rowKey={coin => coin.coin_id} scroll={{ x: '100%' }} dataSource={compared.sort(dynamicSort('full_name'))} columns={dynaColumn} />}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};