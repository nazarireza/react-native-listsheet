import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity
} from 'react-native';

import Modal from './Modal';

class ListSheet extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedItems: []
		};
	}

	selectItem = item => {
		const { selectedItems } = this.state;
		const { multiSelect } = this.props;

		let newSelectedItems = !multiSelect ? [item] : [...selectedItems, item];

		this.setState({
			selectedItems: newSelectedItems
		});
	};

	deSelectItem = index => {
		const { selectedItems } = this.state;

		let newSelectedItems = [
			...selectedItems.slice(0, index),
			...selectedItems.slice(index + 1)
		];

		this.setState({
			selectedItems: newSelectedItems
		});
	};

	toggleItem = (index, item) => {
		let { isSelected, selectedIndex } = this.itemIsSelected(index, item);

		isSelected && this.deSelectItem(selectedIndex);
		!isSelected && this.selectItem(item);
	};

	itemIsSelected = (index, item) => {
		const { keyExtractor } = this.props;
		const { selectedItems } = this.state;

		let selectedIndex = selectedItems.findIndex(
			(p, i) => keyExtractor(p, i) === keyExtractor(item, index)
		);

		return {
			isSelected: selectedIndex !== -1,
			selectedIndex: selectedIndex
		};
	};

	renderItem = ({ index, item }) => {
		const { renderItem } = this.props;

		let { isSelected } = this.itemIsSelected(index, item);

		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={this.toggleItem.bind(this, index, item)}
			>
				{renderItem({ index, item, isSelected })}
			</TouchableOpacity>
		);
	};

	renderContentLoaderItem = ({ index, item }) => {
		const { ContentLoaderComponent } = this.props;

		return <View key={`cl-${index}`}>{ContentLoaderComponent}</View>;
	};

	render() {
		const {
			title,
			description,
			data,
			ItemSeparatorComponent,
			keyExtractor,
			ListEmptyComponent,
			loading,
			onSelect,
			onDismiss,
			show
		} = this.props;
		const { selectedItems } = this.state;

		return (
			<Modal isVisible={show} useNativeDriver style={styles.container}>
				<View style={[styles.listContainer]}>
					{title && <Text style={styles.titleText}>{title}</Text>}
					{description && (
						<Text style={styles.descriptionsText}>{description}</Text>
					)}
					<FlatList
						data={loading ? [1, 2, 3] : data}
						extraData={selectedItems}
						contentContainerStyle={styles.itemsContainer}
						renderItem={item =>
							loading
								? this.renderContentLoaderItem(item)
								: this.renderItem(item)
						}
						ItemSeparatorComponent={ItemSeparatorComponent}
						keyExtractor={keyExtractor}
						ListEmptyComponent={ListEmptyComponent}
					/>
					<View style={styles.actionsContainer}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => onDismiss && onDismiss()}
							style={[
								styles.actionButtonContainer,
								styles.cancelButtonContainer
							]}
						>
							<Text style={[styles.actionButtonText, styles.cancelButtonText]}>
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => onSelect && onSelect(selectedItems)}
							style={[styles.actionButtonContainer, styles.okButtonContainer]}
						>
							<Text style={[styles.actionButtonText, styles.okButtonText]}>
								Ok
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-end',
		margin: 0
	},
	listContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 17
	},
	titleText: {
		color: '#202020',
		fontSize: 16,
		fontWeight: 'bold',
		fontFamily: 'Montserrat'
	},
	descriptionsText: {
		color: '#545454',
		fontSize: 12,
		fontFamily: 'Montserrat'
	},
	itemsContainer: {
		paddingVertical: 15
	},
	actionsContainer: {
		flexDirection: 'row'
	},
	actionButtonContainer: {
		flex: 1,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 50
	},
	cancelButtonContainer: {
		backgroundColor: '#efefef'
	},
	cancelButtonText: {},
	okButtonContainer: {
		backgroundColor: '#f4354c',
		marginLeft: 5
	},
	okButtonText: {
		color: 'white'
	},
	actionButtonText: {
		fontSize: 16,
		fontFamily: 'Montserrat'
	}
});

export default ListSheet;
