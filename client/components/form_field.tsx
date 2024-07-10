import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { Key, useEffect, useState, useCallback, useRef } from "react";
import { icons } from ".././constants";
import { BASEURL, useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType: string;
  inputStyles: string;
};

interface Category {
  categoryId: string;
  categoryName: string;
  owner: string;
  createdAt: string;
  updateAt: string;
}

interface OptionItem {
  value: string;
  label: string;
}

const FormField: React.FC<Props> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  inputStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [inputHeight, setInputHeight] = useState(40);

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const { authState } = useAuth();

  const getCategories = async () => {
    const token = authState?.token;
    const baseUrl = BASEURL;

    try {
      const getCategoriesRequest = await axios.post(
        `${baseUrl}/categories/get_user_categories`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (getCategoriesRequest.status === 200) {
        console.log(getCategoriesRequest.data);
        const fetchedCategories = getCategoriesRequest.data.categories.map(
          (category: Category, key: Key) => ({
            label: category.categoryName,
            value: category.categoryName,
            key: key,
          })
        );
        setCategories(fetchedCategories);
      }
      if (getCategoriesRequest.status === 404) {
        // setNoJournalsFound(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    handleChangeText(value);
    console.log(value);
  };

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const buttonRef = useRef<View>(null);
  const [top, setTop] = useState(0);

  const onSelect = useCallback((item: OptionItem) => {
    handleCategoryChange(item.value);
    setExpanded(false);
  }, []);

  return (
    <View className={`${otherStyles}`}>
      <Text className="font-psemibold text-xl mb-2">{title}</Text>

      <View className={`${inputStyles}`}>
        {title === "Category" ? (
          <View
            ref={buttonRef}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              const topOffset = layout.y;
              const heightOfComponent = layout.height;

              const finalValue =
                topOffset +
                heightOfComponent +
                (Platform.OS === "android" ? -32 : 3);

              setTop(finalValue);
            }}
          >
            <TouchableOpacity
              style={dropdownStyles.button}
              activeOpacity={0.8}
              onPress={toggleExpanded}
            >
              <Text style={dropdownStyles.text}>
                {category ? category : value ? value : placeholder}
              </Text>
              <AntDesign name={expanded ? "caretup" : "caretdown"} />
            </TouchableOpacity>
            {expanded ? (
              <Modal visible={expanded} transparent>
                <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
                  <View style={dropdownStyles.backdrop}>
                    <View
                      style={[
                        dropdownStyles.options,
                        {
                          bottom: 150,
                        },
                      ]}
                    >
                      <FlatList
                        keyExtractor={(item) => item.value}
                        data={categories}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={dropdownStyles.optionItem}
                            onPress={() => onSelect(item)}
                          >
                            <Text>{item.label}</Text>
                          </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={dropdownStyles.separator} />
                        )}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            ) : null}
          </View>
        ) : (
          <TextInput
            className="flex-1 text-white font-psemibold w-full"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#ff6000"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && !showPassword}
            multiline={title === "Content"}
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
            style={{ height: Math.max(40, inputHeight) }}
          />
        )}

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Confirm Password" && (
          <TouchableOpacity
            onPress={() => setConfirmShowPassword(!showConfirmPassword)}
          >
            <Image
              source={!showConfirmPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Search" && (
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={icons.search}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  backdrop: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  optionItem: {
    height: 40,
    justifyContent: "center",
  },
  separator: {
    height: 4,
  },
  options: {
    position: "absolute",
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 6,
    maxHeight: 250,
  },
  text: {
    fontSize: 15,
    opacity: 0.8,
  },
  button: {
    height: 50,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
});

export default FormField;
