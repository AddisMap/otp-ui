// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import { Config, Leg, TimeOptions } from "@opentripplanner/types";
import React, { Component, FunctionComponent, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { VelocityTransitionGroup } from "velocity-react";

import AccessLegSteps from "./access-leg-steps";
import AccessLegSummary from "./access-leg-summary";
import LegDiagramPreview from "./leg-diagram-preview";
import MapillaryButton from "./mapillary-button";
import RentedVehicleSubheader from "./rented-vehicle-subheader";
import * as S from "../styled";
import { defaultMessages } from "../util";

import TNCLeg from "./tnc-leg";

interface Props {
  config: Config;
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible?: Leg;
  followsTransit?: boolean;
  leg: Leg;
  LegIcon: FunctionComponent<{ leg: Leg }>;
  legIndex: number;
  mapillaryCallback?: (id: string) => void;
  mapillaryKey?: string;
  setActiveLeg: (legIndex: number, leg: Leg) => void;
  setLegDiagram: (leg: Leg) => void;
  showElevationProfile: boolean;
  showLegIcon: boolean;
  timeOptions?: TimeOptions;
}

interface State {
  expanded: boolean;
}

/**
 * Component for access (e.g. walk/bike/etc.) leg in narrative itinerary. This
 * particular component is used in the line-itin (i.e., trimet-mod-otp) version
 * of the narrative itinerary.
 */
class AccessLegBody extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { expanded: false };
  }

  onStepsHeaderClick = (): void => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  onSummaryClick = (): void => {
    const { leg, legIndex, setActiveLeg } = this.props;
    setActiveLeg(legIndex, leg);
  };

  render(): ReactElement {
    const {
      config,
      diagramVisible,
      followsTransit,
      leg,
      LegIcon,
      mapillaryCallback,
      mapillaryKey,
      setLegDiagram,
      showElevationProfile,
      showLegIcon,
      timeOptions
    } = this.props;
    const { expanded } = this.state;

    if (leg.mode === "CAR" && leg.hailedCar) {
      return (
        <TNCLeg
          config={config}
          followsTransit={followsTransit}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={this.onSummaryClick}
          showLegIcon={showLegIcon}
          timeOptions={timeOptions}
        />
      );
    }

    return (
      <>
        {/* Place subheading: rented vehicle (e.g., scooter, bike, car)
          pickup */}
        {leg && (leg.rentedVehicle || leg.rentedBike || leg.rentedCar) && (
          <RentedVehicleSubheader config={config} leg={leg} />
        )}
        <S.LegBody>
          <AccessLegSummary
            config={config}
            leg={leg}
            LegIcon={LegIcon}
            onSummaryClick={this.onSummaryClick}
            showLegIcon={showLegIcon}
          />
          <S.StepsHeader
            aria-expanded={expanded}
            onClick={this.onStepsHeaderClick}
          >
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.ItineraryBody.common.durationShort"]
              }
              description="Duration in abbreviated hours (if over one hour) and minutes"
              id="otpUi.ItineraryBody.common.durationShort"
              values={coreUtils.time.toHoursMinutesSeconds(leg.duration)}
            />
            {leg.steps && (
              <span>
                {" "}
                <S.CaretToggle expanded={expanded} />
              </span>
            )}
          </S.StepsHeader>
          <MapillaryButton
            coords={leg.from}
            clickCallback={mapillaryCallback}
            mapillaryKey={mapillaryKey}
            padTop
          />
          <LegDiagramPreview
            diagramVisible={diagramVisible}
            leg={leg}
            setLegDiagram={setLegDiagram}
            showElevationProfile={showElevationProfile}
          />
          <VelocityTransitionGroup
            enter={{ animation: "slideDown" }}
            leave={{ animation: "slideUp" }}
          >
            {expanded && (
              <AccessLegSteps
                steps={leg.steps}
                mapillaryCallback={mapillaryCallback}
                mapillaryKey={mapillaryKey}
              />
            )}
          </VelocityTransitionGroup>
        </S.LegBody>
      </>
    );
  }
}

export default AccessLegBody;

export {
  AccessLegSteps,
  AccessLegSummary,
  LegDiagramPreview,
  RentedVehicleSubheader,
  S as Styled,
  TNCLeg
};
