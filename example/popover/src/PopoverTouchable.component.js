import * as PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { 
  Dimensions, 
  findNodeHandle, 
  NativeModules,
  Keyboard
} from "react-native";

class PopoverTouchable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPopover: false,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      keyboardHidden: true,
      pressCount: 0
    };
  }
    
  componentDidMount() {
    Dimensions.addEventListener("change", this.onOrientationChange);
    Keyboard.addEventListener("keyboardDidShow", this.keyboardDidShow);
    Keyboard.addEventListener("keyboardDidHide", this.keyboardDidHide);
  }
    
  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onOrientationChange);
    Keyboard.removeEventListener("keyboardDidShow", this.keyboardDidShow);
    Keyboard.removeEventListener("keyboardDidHide", this.keyboardDidHide);
  }
  
  onOrientationChange = () => {
    if (this.state.showPopover) {
    // Need to measure touchable and setFrom rect on popover again
      requestAnimationFrame(this.onPress);
    }
  };

  keyboardDidShow = () => this.setState({keyboardHidden: false});

  keyboardDidHide = () => {
    this.setState({keyboardHidden: true});

    const handle = findNodeHandle(this.touchable);
    if (handle && this.pressCount) {
      NativeModules.UIManager.measure(handle, this.onTouchableMeasured);
      this.setState({pressCount: 0});
    }
  }
  
  touchable = null;
  
  setRef = (ref) => { this.touchable = ref; };
  
  onPress = () => {
    const handle = findNodeHandle(this.touchable);
    if (handle && this.state.keyboardHidden) {
      NativeModules.UIManager.measure(handle, this.onTouchableMeasured);
      this.setState({pressCount: 0});
    } else {
      Keyboard.dismiss();
    }
  };
  
  onTouchableMeasured = (x0, y0, width, height, x, y) => {
    this.setState(
      {
        showPopover: true,
        popoverAnchor: { x, y, width, height },
      },
      () => {
        if (this.props.onPopoverDisplayed) {
          this.props.onPopoverDisplayed();
        }
      },
    );
  };

  onClosePopover = () => this.setState({ showPopover: false });

  render() {
    const children = React.Children.toArray(this.props.children);
    if (
      children.length !== 2 ||
      children[1] instanceof Number ||
      children[1] instanceof String ||
      (children[1]).type.displayName !== "Popover"
    ) {
      throw new Error("Popover touchable must have two children and the second one must be Popover");
    }
    return (
      <React.Fragment>
        {
          React.cloneElement(children[0], {
            ref: this.setRef,
            onPress: this.onPress,
          })
        }
        {
          React.cloneElement(children[1], {
            visible: this.state.showPopover,
            onClose: this.onClosePopover,
            fromRect: this.state.popoverAnchor,
          })
        }
      </React.Fragment>
    );
  }
}

PopoverTouchable.propTypes = {
  onPopoverDisplayed: PropTypes.func,
  children: PropTypes.any
};

export default PopoverTouchable;