import React, { useState, useEffect } from 'react';
import Customer from './CustomersTableItem';

function CustomersTable({
  selectedItems
}) {

  const customers = [
    {
      id: '0',
      name: 'Patricia Semklo',
      email: 'patricia.semklo@app.com',
      location: '🇬🇧 London, UK',
      orders: '24',
      lastOrder: '#123567',
      spent: '$2,890.66',
      refunds: '-',
      fav: true
    },
    {
      id: '1',
      name: 'Dominik Lamakani',
      email: 'dominik.lamakani@gmail.com',
      location: '🇩🇪 Dortmund, DE',
      orders: '77',
      lastOrder: '#779912',
      spent: '$14,767.04',
      refunds: '4',
      fav: false
    },
    {
      id: '2',
      name: 'Ivan Mesaros',
      email: 'imivanmes@gmail.com',
      location: '🇫🇷 Paris, FR',
      orders: '44',
      lastOrder: '#889924',
      spent: '$4,996.00',
      refunds: '1',
      fav: true
    },
    {
      id: '3',
      name: 'Maria Martinez',
      email: 'martinezhome@gmail.com',
      location: '🇮🇹 Bologna, IT',
      orders: '29',
      lastOrder: '#897726',
      spent: '$3,220.66',
      refunds: '2',
      fav: false
    },
    {
      id: '4',
      name: 'Vicky Jung',
      email: 'itsvicky@contact.com',
      location: '🇬🇧 London, UK',
      orders: '22',
      lastOrder: '#123567',
      spent: '$2,890.66',
      refunds: '-',
      fav: true
    },
    {
      id: '5',
      name: 'Tisho Yanchev',
      email: 'tisho.y@kurlytech.com',
      location: '🇬🇧 London, UK',
      orders: '14',
      lastOrder: '#896644',
      spent: '$1,649.99',
      refunds: '1',
      fav: true
    },
    {
      id: '6',
      name: 'James Cameron',
      email: 'james.ceo@james.tech',
      location: '🇫🇷 Marseille, FR',
      orders: '34',
      lastOrder: '#136988',
      spent: '$3,569.87',
      refunds: '2',
      fav: true
    },
    {
      id: '7',
      name: 'Haruki Masuno',
      email: 'haruki@supermail.jp',
      location: '🇯🇵 Tokio, JP',
      orders: '112',
      lastOrder: '#442206',
      spent: '$19,246.07',
      refunds: '6',
      fav: false
    },
    {
      id: '8',
      name: 'Joe Huang',
      email: 'joehuang@hotmail.com',
      location: '🇨🇳 Shanghai, CN',
      orders: '64',
      lastOrder: '#764321',
      spent: '$12,276.92',
      refunds: '-',
      fav: true
    },
    {
      id: '9',
      name: 'Carolyn McNeail',
      email: 'carolynlove@gmail.com',
      location: '🇮🇹 Milan, IT',
      orders: '19',
      lastOrder: '#908764',
      spent: '$1,289.97',
      refunds: '2',
      fav: false
    }
  ];

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(customers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(list.map(li => li.id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  useEffect(() => {
    selectedItems(isCheck);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">All Customers <span className="text-slate-400 font-medium">248</span></h2>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input className="form-checkbox" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <span className="sr-only">Favourite</span>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Order</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Location</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold">Orders</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Last order</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Total spent</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold">Refunds</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <span className="sr-only">Menu</span>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200">
              {
                list.map(customer => {
                  return (
                    <Customer
                      key={customer.id}
                      id={customer.id}
                      name={customer.name}
                      email={customer.email}
                      location={customer.location}
                      orders={customer.orders}
                      lastOrder={customer.lastOrder}
                      spent={customer.spent}
                      refunds={customer.refunds}
                      fav={customer.fav}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(customer.id)}
                    />
                  )
                })
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default CustomersTable;
