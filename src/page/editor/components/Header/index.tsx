import { Button, Space, Modal, Input, Checkbox, Avatar } from "antd";
import { useState } from "react";
import { useComponetsStore } from "../../stores/components";
import { useAddRemoteComponentConfig } from "../../hooks/useAddRemoteComponentConfig";
import { useAddRemoteComponentConfigVue } from "../../hooks/useAddRemoteComponentComfigVue";
import { useNavigate } from "react-router-dom";
import { useComponentsShow } from "../../stores/component-show";
import { useComponentsStore } from "../../stores/component-total";
import axios from "axios";
import { useComponentConfigStore } from '../../stores/component-config';
import { exportHTML } from '../../../../utils/exportHTML';

export function Header() {
  const { mode, setMode, setCurComponentId, components, clearComponents } =
    useComponetsStore();
  const [modalVisibleReact, setModalVisibleReact] = useState(false);
  const [modalVisibleVue, setModalVisibleVue] = useState(false);
  const [inputUrlReact, setInputUrlReact] = useState("");
  const [inputUrlVue, setInputUrlVue] = useState("");
  const [remoteUrlReact, setRemoteUrlReact] = useState(
    "https://cdn.jsdelivr.net/npm/pjw-remote-component@1.0.5/dist/bundle.umd.js"
  );
  const [remoteUrlVue, setRemoteUrlVue] = useState(
    "https://cdn.jsdelivr.net/npm/pjw-remote-component-vue@1.0.3/dist/bundle.umd.js"
  );
  const navigate = useNavigate();
  const { addFormObject, addComponentToForm, objectTotal } =
    useComponentsStore();
  const [locodeVisible, setLocodeVisible] = useState(false);
  const [name, setName] = useState("");
  const [pm, setpm] = useState("");
  const [isTemplate, setIsTemplate] = useState(false); // 存储是否设置为模板的状态
  const { componentConfig } = useComponentConfigStore();

  useAddRemoteComponentConfig(remoteUrlReact);
  // useAddRemoteComponentConfigVue(remoteUrlVue);

  const handleLoadRemoteReactComponent = () => {
    setRemoteUrlReact(inputUrlReact);
    setModalVisibleReact(false);
  };

  const handleLoadRemoteVueComponent = () => {
    setRemoteUrlVue(inputUrlVue);
    setModalVisibleVue(false);
  };

  const slowhandel = () => {
    const componentWithId = {
      component: components[0], //json
      uindex: components[0].id + Date.now(), //组件id
      fname: name, //表单名称
    };
    const componentWithId2 = {
      ...components[0],
      uindex: components[0].id + Date.now(),
      form: name,
    };
    const formObject2 = {
      fname: pm,
      componentForm: [componentWithId2],
      isTemplate: isTemplate, // 添加 isTemplate 到 formObject
    };
    const formObject = {
      username: localStorage.getItem("username"), //用户信息
      pm: pm, //项目名称
      componentForm: [componentWithId], //表单信息
      isTemplate: isTemplate, // 添加 isTemplate 到 formObject
    };

    const existingForm = objectTotal.find((form) => form.fname === pm);

    if (!existingForm) {
      addFormObject(formObject2);
      axios
        .post("/api/forms", formObject)
        .then((response) => {
          console.log("数据成功发送到后端:", response.data);
        })
        .catch((error) => {
          console.error("发送数据时发生错误:", error);
        });
    } else {
      addComponentToForm(pm, componentWithId2);
      // 更新现有 formObject 并发送到后端
      axios
        .put(`/api/forms/${pm}`, {
          component: componentWithId,
        })
        .then((response) => {
          console.log("更新数据成功:", response.data);
        })
        .catch((error) => {
          console.error("更新数据时发生错误:", error);
        });
    }

    setLocodeVisible(false);
    navigate(`/show`);
    clearComponents();
  };

  const handleExport = () => {
    exportHTML({
      components,
      componentConfig
    });
  };

  return (
    <div className="w-full h-full">
      <div className="h-full flex justify-between items-center px-[20px] bg-gray-900 text-white shadow-lg">
        <div className="text-xl font-bold">ChangeLowCode</div>
        <Avatar size={14} className="mr-4" />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setLocodeVisible(true);
            }}
            className="px-4 py-2"
          >
            保存
          </Button>

          {mode === "edit" && (
            <Button
              onClick={() => {
                setMode("preview");
                setCurComponentId(null);
              }}
              type="primary"
              className="px-4 py-2"
            >
              预览
            </Button>
          )}
          {mode === "preview" && (
            <Button
              onClick={() => setMode("edit")}
              type="primary"
              className="px-4 py-2"
            >
              退出预览
            </Button>
          )}
          <Button
            type="primary"
            onClick={() => setModalVisibleReact(true)}
            className="px-4 py-2"
          >
            加载远程 React 组件
          </Button>

          <Button
            type="primary"
            onClick={() => setModalVisibleVue(true)}
            className="px-4 py-2"
          >
            加载远程 Vue 组件
          </Button>

          <Button
            type="primary"
            onClick={handleExport}
          >
            导出HTML
          </Button>
        </Space>
      </div>

      {/* React Modal 弹窗 */}
      <Modal
        title="输入远程 React 组件 URL"
        open={modalVisibleReact}
        onOk={handleLoadRemoteReactComponent}
        onCancel={() => setModalVisibleReact(false)}
        className="rounded-lg shadow-lg"
      >
        <Input
          placeholder="输入远程 React 组件 URL"
          value={inputUrlReact}
          onChange={(e) => setInputUrlReact(e.target.value)}
          className="rounded-lg"
        />
      </Modal>

      {/* Vue Modal 弹窗 */}
      <Modal
        title="输入远程 Vue 组件 URL"
        open={modalVisibleVue}
        onOk={handleLoadRemoteVueComponent}
        onCancel={() => setModalVisibleVue(false)}
        className="rounded-lg shadow-lg"
      >
        <Input
          placeholder="输入远程 Vue 组件 URL"
          value={inputUrlVue}
          onChange={(e) => setInputUrlVue(e.target.value)}
          className="rounded-lg"
        />
      </Modal>

      {/* 保存低代码 Modal 弹窗 */}
      <Modal
        title="保存低代码"
        open={locodeVisible}
        onOk={slowhandel}
        onCancel={() => setLocodeVisible(false)}
        className="rounded-lg shadow-lg"
        style={{ padding: "20px" }}
      >
        <Input
          placeholder="输入表单名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg"
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <Input
          placeholder="输入项目名称"
          value={pm}
          onChange={(e) => setpm(e.target.value)}
          className="rounded-lg"
          style={{ marginBottom: "16px", width: "100%" }}
        />
        <Checkbox
          style={{ marginTop: "16px" }}
          checked={isTemplate}
          onChange={(e) => setIsTemplate(e.target.checked)} // 监听复选框变化
        >
          设置为模板
        </Checkbox>
      </Modal>
    </div>
  );
}
