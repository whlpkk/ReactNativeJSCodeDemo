/*
 *
 * @providesModule TBTagFlow
 */
'use strict';

var ListViewDataSource = require('ListViewDataSource');
var React = require('React');
var View = require('View');
var StaticRenderer = require('StaticRenderer');
var logError = require('logError');
var merge = require('merge');
var TBTAGVIEW_REF = 'tbtagflow';

var PropTypes = React.PropTypes;

var TBTagFlow = React.createClass({
    propTypes: {
        ...View.propTypes,
        renderItem: PropTypes.func.isRequired,
        renderScrollComponent: React.PropTypes.func.isRequired
    },
    getDefaultProps: function() {
        return {
            initialListSize: 1000,
            renderScrollComponent: props => <View {...props} />
        };
    },
    setNativeProps: function(props) {
        this.refs[TBTAGVIEW_REF].setNativeProps(props);
    },
    getInitialState: function() {
        return {
            curRenderedRowsCount: this.props.initialListSize,
            prevRenderedRowsCount: 0,
            highlightedRow: {}
        };
    },
    //参照ListView的方式
    render: function () {
        var bodyComponents = [];
        var dataSource = this.props.dataSource;
        var allRowIDs = dataSource.rowIdentities;
        var rowCount = 0;

        var header = this.props.renderHeader && this.props.renderHeader();
        var footer = this.props.renderFooter && this.props.renderFooter();
        var totalIndex = header ? 1 : 0;
        for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
            var sectionID = dataSource.sectionIdentities[sectionIdx];
            var rowIDs = allRowIDs[sectionIdx];
            if (rowIDs.length === 0) {
                continue;
            }

            if (this.props.renderSectionHeader) {
                //不包含
            }

            for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
                var rowID = rowIDs[rowIdx];
                var comboID = sectionID + '_' + rowID;
                var shouldUpdateRow = rowCount >= this.state.prevRenderedRowsCount &&
                    dataSource.rowShouldUpdate(sectionIdx, rowIdx);
                var row =
                    <StaticRenderer
                        key={'r_' + comboID}
                        shouldUpdate={!!shouldUpdateRow}
                        render={this.props.renderItem.bind(
              null,
              dataSource.getRowData(sectionIdx, rowIdx),
              sectionID,
              rowID,
              this.onRowHighlighted
            )}
                    />;
                bodyComponents.push(row);
                totalIndex++;


                if (++rowCount === this.state.curRenderedRowsCount) {
                    break;
                }
            }
            if (rowCount >= this.state.curRenderedRowsCount) {
                break;
            }
        }

        var {
            renderScrollComponent,
            ...props,
            } = this.props;

        if (props.removeClippedSubviews === undefined) {
            props.removeClippedSubviews = true;
        }

        // component's original ref instead of clobbering it
        return React.cloneElement(renderScrollComponent(props), {
            ref: TBTAGVIEW_REF
        }, header, bodyComponents, footer);
    },
    onRowHighlighted: function(sectionID, rowID) {
        this.setState({highlightedRow: {sectionID, rowID}});
    }
});

module.exports = TBTagFlow;