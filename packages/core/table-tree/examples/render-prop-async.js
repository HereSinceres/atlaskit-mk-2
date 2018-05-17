// @flow
import React, { Component } from 'react';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
  TableTreeDataHelper,
} from '../src';

let uuid = 0;

const ROOTS = [
  {
    title: 'Chapter 1: Clean Code',
    id: ++uuid,
    page: 1,
    numbering: '1',
    hasChildren: true,
  },
  {
    title: 'Chapter 2: Meaningful names',
    id: ++uuid,
    page: 17,
    numbering: '2',
  },
  {
    title: 'Chapter 3: Functions',
    id: ++uuid,
    page: 17,
    numbering: '3',
    hasChildren: true,
  },
  {
    title: 'Chapter 4: Comments',
    id: ++uuid,
    page: 53,
    numbering: '4',
    children: [],
  },
  {
    title: 'Chapter 5: Formatting',
    id: ++uuid,
    page: 75,
    numbering: '5',
    children: [],
  },
];

function getChildren() {
  return [
    {
      title: 'There Will Be Code',
      id: ++uuid,
      page: 2,
      numbering: '1.1',
      hasChildren: true,
    },
    {
      title: 'Bad code',
      id: ++uuid,
      page: 3,
      numbering: '1.2',
    },
    {
      title: 'The Total Cost of Owning a Mess',
      id: ++uuid,
      page: 4,
      numbering: '1.3',
      hasChildren: true,
    },
  ];
}

function fetchRoots() {
  return Promise.resolve(ROOTS);
}

function fetchChildrenOf() {
  return Promise.resolve(getChildren());
}

function getData(parentItem: ?Object) {
  return !parentItem ? fetchRoots() : fetchChildrenOf();
}

const tableTreeHelper = new TableTreeDataHelper('id');

export default class extends Component<*, *> {
  state = {
    items: [],
  };

  componentDidMount() {
    this.loadTableData();
  }

  loadTableData = (parentItem: ?Object) => {
    if (parentItem && parentItem.childIds) {
      return;
    }

    getData(parentItem).then(items => {
      this.setState({
        items: tableTreeHelper.updateItems(items, this.state.items, parentItem),
      });
    });
  };

  render() {
    const { items } = this.state;
    return (
      <TableTree>
        <Headers>
          <Header width={300}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          items={items}
          render={({ title, numbering, page, hasChildren, children }) => (
            <Row
              expandLabel={'Expand'}
              collapseLabel={'Collapse'}
              itemId={numbering}
              onExpand={this.loadTableData}
              items={children}
              hasChildren={hasChildren}
            >
              <Cell singleLine>{title}</Cell>
              <Cell singleLine>{numbering}</Cell>
              <Cell singleLine>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );
  }
}
