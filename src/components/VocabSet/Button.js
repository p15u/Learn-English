import React from "react";
import styled from "styled-components";

import Text from "../Text";

const Button = (props) => {
  return (
    <AddVocabContainer>
      <AddPanelTouch onPress={props.handleCreateVocab}>
        <TextDecorate bold>{props.title}</TextDecorate>
      </AddPanelTouch>
    </AddVocabContainer>
  );
};

export default Button;

const AddVocabContainer = styled.View`
  width: 100%;
  padding: 10px 20px 10px 20px;
  box-shadow: -8px 10px 10px #888888;
`;

const AddPanelTouch = styled.TouchableOpacity`
  width: 100%;
  background-color: #4a90e2;
  padding: 20px;
  align-items: center;
  border-radius: 20px;
`;

const TextDecorate = styled(Text)`
  border-bottom-color: #ffffff;
  border-bottom-width: 3px;
  color: #ffffff;
`;
