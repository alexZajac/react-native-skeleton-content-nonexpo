import { shallow } from "enzyme";
import React from "react";
import { SkeletonContent } from "../SkeletonContent";

describe("SkeletonComponent testing", () => {
  it("should render empty alone", () => {
    const component = shallow<SkeletonContent>(<SkeletonContent />);
    expect(component).toMatchSnapshot();
  });
});
