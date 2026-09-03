import TextInput from "@/components/TextInput";
import { ProfileSchema } from "@/lib/schema/resisterSchema";
import clsx from "clsx";
import { Label, Radio, RadioGroup } from "@heroui/react";
import { subYears, format } from "date-fns";
import { Control, Controller } from "react-hook-form";
import { FaMale, FaFemale } from "react-icons/fa";

type ProfileFormProps = {
  control: Control<ProfileSchema>;
};

export const ProfileForm = ({ control }: ProfileFormProps) => {
  const genderList = [
    { icon: FaMale, value: "male", label: "Male" },
    { icon: FaFemale, value: "female", label: "Female" },
  ];

  return (
    <div>
      <Controller
        name="gender"
        control={control}
        render={({ field, fieldState }) => (
          <RadioGroup
            value={field.value}
            onChange={field.onChange}
            className="pb-3"
          >
            <Label>Gender</Label>
            <div className="grid grid-cols-2 gap-4">
              {genderList.map((gender) => (
                <Radio
                  key={gender.value}
                  value={gender.value}
                  className="group mt-0"
                >
                  <Radio.Content
                    className={clsx(
                      "relative flex flex-row items-center gap-4 border border-gray-400 p-5",
                      "group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent/10",
                    )}
                  >
                    <gender.icon size={24} />
                    <div> {gender.label}</div>
                  </Radio.Content>
                </Radio>
              ))}
            </div>
            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </RadioGroup>
        )}
      />
      <TextInput
        control={control}
        name="dateOfBirth"
        label="Date of Birth"
        type="date"
        max={format(subYears(new Date(), 18), "yyyy-MM-dd")}
      />
      <TextInput
        control={control}
        name="description"
        label="Description"
        multiline
      />
      <TextInput control={control} name="city" label="City" />
      <TextInput control={control} name="country" label="Country" />
    </div>
  );
};
