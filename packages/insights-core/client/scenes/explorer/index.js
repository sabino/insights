import './styles.scss'

// libraries
import React, { Component } from 'react'
import { connect } from 'kea/logic'

// utils
import { Layout, LayoutSplitter } from 'react-flex-layout'
import { Button } from "@blueprintjs/core";

// components
import Graph from './graph'
import TimeFilter from './time-filter'
import Pagination from './pagination'
import Tree from './tree'
import Table from './table'
import Filter from './filter'
import AddToDashboard from './add-to-dashboard'

// logic
import explorerLogic from '~/scenes/explorer/logic'

@connect({
  actions: [
    explorerLogic, [
      'refreshData'
    ]
  ],
  props: [
    explorerLogic, [
      'graph',
      'graphData',
      'graphKeys',
      'isSubmitting',
      'columns',
      'filter',
      'selectedModel'
    ]
  ]
})
export default class Explorer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      filterHeight: 40
    }
  }

  setFilterHeight = (filterHeight) => {
    if (this.state.filterHeight !== filterHeight) {
      this.setState({ filterHeight })
    }
  }

  render () {
    const { graphData, isSubmitting, columns, graph, graphKeys, selectedModel } = this.props
    const { filterHeight } = this.state
    const { refreshData } = this.props.actions

    return (
      <Layout className='explorer-scene' ref={ref => { this._layout = ref }}>
        <Layout layoutWidth={300} className='explorer-tree-bar'>
          <Tree />
        </Layout>
        <LayoutSplitter />
        <Layout layoutWidth='flex' ref={ref => { this._rightPane = ref }}>
          <Layout layoutHeight={50}>
            <div style={{padding: 10}}>
              <div className='top-controls'>
                {columns.length > 0 ? (
                  <Button icon='refresh' loading={isSubmitting} onClick={refreshData}>
                    Reload
                  </Button>
                ) : null}
                {graphData ? (
                  <AddToDashboard />
                ) : null}
                {graphData ? (
                  <TimeFilter />
                ) : null}
              </div>
              <div className='top-pagination'>
                <Pagination />
              </div>
            </div>
          </Layout>
          <Layout layoutHeight={filterHeight}>
            {selectedModel ? <Filter setFilterHeight={this.setFilterHeight} /> : null}
          </Layout>
          {graphData ? (
            <Layout layoutHeight={300}>
              <Graph graph={graph} graphKeys={graphKeys} graphData={graphData} />
            </Layout>
          ) : <div />}
          {graphData ? <LayoutSplitter /> : <div />}
          <Layout layoutHeight='flex'>
            <Table />
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
