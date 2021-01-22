import React, { Component } from "react";
import Reward from "react-rewards";

export const withReward = (WrappedComponent) =>
  class Wrapper extends Component {
    triggerReward = () => {
      this.reward.rewardMe();
    };

    render() {
      const { config = {}, type = "confetti", ...props } = this.props;
      return (
        <Reward
          ref={(ref) => {
            this.reward = ref;
          }}
          type={type}
          {...config}
        >
          <WrappedComponent triggerReward={this.triggerReward} {...props} />
        </Reward>
      );
    }
  };
