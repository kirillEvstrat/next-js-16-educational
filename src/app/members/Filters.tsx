"use client";
import { useEffect } from "react";
import { useFilterParams } from "@/lib/hooks/useFilterParams";
import { UserFilters } from "@/lib/types";
import {
  Button,
  Label,
  ListBox,
  Select,
  Slider,
  Spinner,
  Switch,
} from "@heroui/react";

import { FaFemale, FaMale } from "react-icons/fa";

const defaultFilters: UserFilters = {
  ageRange: [18, 100],
  gender: ["male", "female"],
  orderBy: "updated",
  withPhotos: false,
};

export default function Filters({ totalCount }: { totalCount: number }) {
  const { commit, isPending, searchParams, restore } = useFilterParams();

  const ageRangeParams = searchParams.get("ageRange");
  const genderParams = searchParams.get("gender");
  const withPhotosParams = searchParams.get("withPhotos");

  const filters: UserFilters = {
    ageRange: ageRangeParams
      ? (ageRangeParams.split(",").map(Number) as [number, number])
      : defaultFilters.ageRange,
    gender:
      genderParams !== null
        ? genderParams.split(",").filter(Boolean)
        : defaultFilters.gender,
    orderBy: searchParams.get("orderBy") || defaultFilters.orderBy,
    withPhotos: withPhotosParams !== null ? withPhotosParams === "true" : false,
  };

  const orderByList = [
    { label: "order by: last active", value: "updated" },
    { label: "order by: newest", value: "created" },
  ];

  const genderList = [
    { icon: FaMale, value: "male" },
    { icon: FaFemale, value: "female" },
  ];

  const handleAgeSelect = (ageRange: [number, number]) => {
    commit({ ageRange: ageRange.join(","), page: null });
  };

  const handleorderBy = (value: string) => {
    commit({ orderBy: value, page: null });
  };

  const handleGenderToogle = (gender: string) => {
    const isSelected = filters.gender.includes(gender);
    const next = isSelected
      ? filters.gender.filter((g) => g !== gender)
      : [...filters.gender, gender];
    commit({ gender: next.length ? next.join(",") : "none", page: null });
  };

  const handleWithPhotosToggle = (value: boolean) => {
    commit({
      withPhotos: value ? "true" : "false",
      page: null,
    });
  };

  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <div className="shadow-md mt-4 w-screen bg-white py-3 px-6 z-40 mx-[calc(50%-50vw)]">
      <div className="flex flex-row justify-around items-center">
        <div className="text-accent font-semibold flex gap-3 items-center w-40 shrink-0">
          <span>Results: {totalCount}</span>
          <Spinner className={isPending ? "opacity-100" : "opacity-0"} />
        </div>
        <div className="flex gap-2 items-center">
          <div>Gender: </div>
          <div>
            {genderList.map((gender) => (
              <Button
                key={gender.value}
                size="sm"
                onClick={() => handleGenderToogle(gender.value)}
                variant={
                  filters.gender.includes(gender.value) ? "primary" : "outline"
                }
              >
                <gender.icon size={20} />
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center w-1/5">
          <Slider
            key={filters.ageRange.join("-")}
            className="w-full"
            defaultValue={filters.ageRange}
            minValue={18}
            maxValue={100}
            step={1}
            onChangeEnd={(value) => handleAgeSelect(value as [number, number])}
          >
            <Label>Age range</Label>
            <Slider.Output></Slider.Output>
            <Slider.Track>
              {({ state }) => (
                <>
                  <Slider.Fill />
                  {state.values.map((_, index) => (
                    <Slider.Thumb key={index} index={index} />
                  ))}
                </>
              )}
            </Slider.Track>
          </Slider>
        </div>

        <div className="flex gap-2 items-center w-1/5">
          <Switch
            key={String(filters.withPhotos)}
            onChange={handleWithPhotosToggle}
            defaultSelected={filters.withPhotos}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              With photos
            </Switch.Content>
          </Switch>
        </div>
        <div className="flex gap-2 items-center w-1/5">
          <Select
            className="w-full"
            defaultValue={filters.orderBy}
            placeholder="Order by"
            onChange={(key) => handleorderBy(key as string)}
            key={filters.orderBy}
          >
            <Select.Trigger className="w-full">
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {orderByList.map((order) => (
                  <ListBox.Item
                    key={order.value}
                    id={order.value}
                    textValue={order.value}
                  >
                    {order.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
}
