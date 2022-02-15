import React from "react";
import styled from "styled-components";

import Text from "../Text";

const VocabSetInput = (props) => {
  return (
    <InputTitleContainer>
      <Text medium bold>
        Title{" "}
        <Text medium bold color="red">
          *
        </Text>
      </Text>
      <InputField
        onChangeText={(title) => props.setVocabSetTitle(title)}
        defaultValue={props.vocabSetTitle}
        placeholder="Enter Title"
      />
      {props.isEmptyTitle === true && (
        <Text style={{ color: "red" }}>Title cannot be empty</Text>
      )}

      <Text medium bold style={{ marginTop: 30 }}>
        Description
      </Text>
      <InputField
        onChangeText={(description) =>
          props.setVocabSetDescription(description)
        }
        defaultValue={props.vocabSetDescription}
        placeholder="Enter description (Optional)"
      />
    </InputTitleContainer>
  );
};

export default VocabSetInput;

const InputTitleContainer = styled.View`
  padding: 0 20px 20px;
`;

const InputField = styled.TextInput`
  border-bottom-color: black;
  border-bottom-width: 2px;
  padding-bottom: 5px;
  font-size: 20px;
`;
