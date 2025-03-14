import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';

const ADDON_ID = 'events';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'events';

const borderStyle = {
  border: '1px solid #eee',
  padding: '5px 20px',
  textAlign: 'left',
};

function getDividedItems(items) {
  return items.reduce(
    (acc, item) => {
      if (Array.isArray(item)) {
        item.forEach((childItem) => {
          acc[1].push(childItem);
        });
      } else {
        acc[0].push(item);
      }

      return acc;
    },
    [[], []],
  );
}

const EventsPanel = () => {
  const value = useParameter(PARAM_KEY, null);
  const items = value || [];

  const [parentItems, childItems] = getDividedItems(items);
  const hasSomeItems = parentItems.length || childItems.length;

  return hasSomeItems ? (
    <div>
      <p style={{ padding: '0 20px' }}>
        Below you can see Event list of current component:
      </p>
      <table style={{ padding: '20px' }}>
        <thead>
          <tr style={borderStyle}>
            <th style={borderStyle}>Event</th>
            <th style={borderStyle}>Description</th>
          </tr>
        </thead>
        <tbody style={borderStyle}>
          {parentItems.map((el) => {
            return (
              <tr style={borderStyle} key={el.value}>
                <td style={borderStyle}>{el.value}</td>
                <td style={borderStyle}>{el.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {childItems.length ? (
        <>
          <div style={{ margin: '5px 20px 0 20px' }}>
            <strong>Children Components Events:</strong>
            <p>
              Below you can see events list of child components, so it means
              that particular component composites <br />
              from few smaller components which are also exposing own events and
              you can handle them in your app.
            </p>
          </div>
          <table style={{ padding: '20px' }}>
            <thead>
              <tr style={borderStyle}>
                <th style={borderStyle}>Event</th>
                <th style={borderStyle}>Description</th>
              </tr>
            </thead>
            <tbody style={borderStyle}>
              {childItems.map((el) => {
                return (
                  <tr style={borderStyle} key={el.value}>
                    <td style={borderStyle}>{el.value}</td>
                    <td style={borderStyle}>{el.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  ) : (
    <div style={{ padding: '20px' }}>Components does not emit any events.</div>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Events',
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <EventsPanel />
      </AddonPanel>
    ),
  });
});
