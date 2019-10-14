import { shallow } from "enzyme";
import React from "react";
import { SkeletonContent } from "../SkeletonContent";

describe("SKC", () => {
  const wrapper = shallow<SkeletonContent>(<SkeletonContent />);

  describe("rendering", () => {
    it("should render a <View />", () => {
      expect(wrapper).toBeDefined();
    });
  });
});
