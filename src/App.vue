<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row :gutter="2" type="flex">
          <el-col :xs="{ span: 1, offset: 0 }" :sm="{ span: 4 }" :md="{ span: 3 }">
            <!-- 参数 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="配置github参数"
              placement="bottom"
            >
              <el-button @click="openParameter" type="primary"> github参数 </el-button>
            </el-tooltip>
          </el-col>
          <el-col :xs="{ span: 2 }" :sm="{ span: 4 }" :md="{ span: 3 }">
            <!-- 元数据 -->

            <el-button @click="open" type="primary"> 设置元数据 </el-button>
          </el-col>
          <el-col :xs="{ span: 4 }" :sm="{ span: 4 }" :md="{ span: 4 }">
            <!-- 列表 -->
            <el-select
              v-model="value"
              filterable
              @change="pushContent"
              placeholder="请选择要编辑的文件  字数"
              clearable
              @clear="clearContent"
            >
              <el-option
                v-for="(item, index) in blogList"
                :key="item.name"
                :label="item.name"
                :value="index"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.size
                }}</span>
              </el-option>
            </el-select>
          </el-col>

          <el-col :xs="{ span: 4, offset: 0 }" :sm="{ span: 4 }" :md="{ span: 2 }">
            <!--  -->
            <el-tooltip
              class="item"
              effect="dark"
              content="提交或者新增文章"
              placement="bottom"
            >
              <el-button @click="submitPost" type="primary">提交</el-button>
            </el-tooltip>
          </el-col>
          <el-col :xs="{ span: 4, offset: 0 }" :sm="{ span: 4 }" :md="{ span: 2 }">
            <!--  -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除选中的文章"
              placement="bottom"
            >
              <el-button @click="deleteSel" type="primary">删除文章</el-button>
            </el-tooltip>
          </el-col>
        </el-row>

        <a href="https://github.com/jw-star/MarkDownMe"
          ><img
            style="
              position: absolute;
              top: 0;
              right: 0;
              border: 0;
              width: 100px;
              height: 100px;
            "
            src="https://github.blog/wp-content/uploads/2008/12/forkme_right_green_007200.png?resize=149%2C149"
            alt="Fork me on GitHub"
        /></a>
      </el-header>
      <!-- 内容 -->
      <el-main
        ><mavon-editor
          v-loading="loading"
          :element-loading-text="loadingText"
          v-model="content"
      /></el-main>

      <el-footer></el-footer>

      <el-drawer
        :before-close="handleClose"
        title="元数据"
        :visible.sync="drawer"
        @close="updateMeta"
      >
        <div class="demo-drawer__content">
          <el-form label-position="left">
            <el-form-item label="作者">
              <el-input v-model="meta.authors" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="meta.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="标签">
              <el-select
                v-model="meta.tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入文章标签"
              >
                <el-option v-for="item in meta.tags" :key="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建日期">
              <div class="block">
                <el-date-picker
                  v-model="meta.date"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </div>
            </el-form-item>

            <el-form-item label="修改日期">
              <div class="block">
                <el-date-picker
                  v-model="meta.lastmod"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>

      <el-drawer
        :before-close="handleClose"
        title="github参数"
        :visible.sync="drawer_git"
        @close="updateGitParam"
      >
        <div class="demo-drawer__content">
          <el-form label-position="left">
            <el-form-item label="token">
              <el-link type="primary" href="https://github.com/settings/tokens"
                >点击链接获取token</el-link
              >
              <el-input v-model="git_token" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="git_username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="仓库名">
              <el-input v-model="git_repo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="文章相对路径">
              <el-input v-model="git_path" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import { getPosts, getContent, updatePost, delPost } from "@/api/index.js";
const jsyaml = require("js-yaml");
export default {
  name: "app",

  components: {},
  data() {
    return {
      value: "",
      content: `---
authors: jw
title: 我的第一篇博文
tags:
  - aa
  - bb
date: '2020-03-06'
lastmod: '2021-04-05 13:07:38'
---

##  `,
      defaultData: "preview",
      blogList: [],
      meta: {
        authors: "",
        title: "",
        tags: [],
        date: "",
        lastmod: new Date(),
      },
      drawer: false,
      drawer_git: false,
      nowtime: new Date(),
      loading: false,
      loadingText: "加载中",
      git_token: localStorage.getItem("git_token"),
      git_username: localStorage.getItem("git_username"),
      git_repo: localStorage.getItem("git_repo"),
      git_path: localStorage.getItem("git_path"),
    };
  },
  methods: {
    Yml2Json(yaml) {
      if (yaml) {
        return JSON.stringify(jsyaml.load(yaml), null, 2);
      }
    },
    Json2Yml(json) {
      if (json) {
        return jsyaml.dump(json);
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    clearMeta() {
      this.meta.authors = "";
      this.meta.title = "";
      this.meta.tags = [];
      this.meta.date = "";
      this.meta.lastmod = "";
    },
    //清空内容
    clearContent() {
      this.content = "";
      this.clearMeta();
      this.loading = false;
    },
    updateGitParam() {
      localStorage.setItem("git_token", this.git_token);
      localStorage.setItem("git_username", this.git_username);
      localStorage.setItem("git_repo", this.git_repo);
      localStorage.setItem("git_path", this.git_path);
    },
    //修改元数据
    updateMeta() {
      console.log(this.selTag);
      var newMeta = this.Json2Yml(this.meta);
      console.log(newMeta);
      let temp = this.content;
      var i = temp.indexOf("---", 3);
      let str = temp.substring(0, i);
      if (i != -1) {
        this.content = `---\n${temp.replace(str, newMeta)}`;
      } else {
        this.content = `---\n${temp.replace(str, newMeta)}\n---\n`;
      }
    },
    deleteSel() {
      this.loading = true;
      this.loadingText = "正在删除";

      var data = {
        message: "删除文章",
        sha: this.blogList[this.value].sha,
      };
      delPost(this.blogList[this.value].path, data)
        .then((res) => {
          this.getPostList();
          this.clearContent();
          this.loading = false;

          this.$message({
            message: "删除成功",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message.error("删除失败,请查看参数设置");
          this.loading = false;
        });
    },
    //提交文章
    submitPost() {
      if (this.content.indexOf("---", 4) == -1) {
        this.$message.error("请设置元数据重新提交");
        return;
      }
      this.loading = true;
      this.loadingText = "正在提交";
      var data;
      var path;

      if (this.value == "") {
        data = {
          message: "新建文章",
          content: this.encode(this.content),
        };
        this.meta = this.getMetaJson();
        path = this.git_path + "/" + this.meta.date + "-" + this.meta.title + ".md";
      } else {
        data = {
          message: "提交修改",
          content: this.encode(this.content),
          sha: this.blogList[this.value].sha,
        };
        path = this.blogList[this.value].path;
      }
      updatePost(path, data)
        .then((res) => {
          this.getPostList();
          this.loading = false;
          this.$message({
            message: "提交成功",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message.error("失败，请保存草稿，重新提交");
          this.loading = false;
        });
    },
    //刷新内容
    pushContent() {
      this.loading = true;
      getContent(this.blogList[this.value].url).then((res) => {
        this.content = this.decode(res.content);
        this.loading = false;
      });
      this.clearMeta();
    },
    //解码
    decode(input) {
      let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      let chr1,
        chr2,
        chr3,
        enc1,
        enc2,
        enc3,
        enc4,
        i = 0,
        output = "";
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      let string = "",
        c = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;
      i = 0;
      while (i < output.length) {
        c = output.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = output.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = output.charCodeAt(i + 1);
          c3 = output.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    },
    encode(input) {
      let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      let chr1,
        chr2,
        chr3,
        enc1,
        enc2,
        enc3,
        enc4,
        i = 0,
        output = "",
        utftext = "";
      input = input.replace(/\r\n/g, "\n");
      for (let n = 0; n < input.length; n++) {
        let c = input.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      while (i < utftext.length) {
        chr1 = utftext.charCodeAt(i++);
        chr2 = utftext.charCodeAt(i++);
        chr3 = utftext.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output =
          output +
          _keyStr.charAt(enc1) +
          _keyStr.charAt(enc2) +
          _keyStr.charAt(enc3) +
          _keyStr.charAt(enc4);
      }
      return output;
    },
    getMetaJson() {
      var i = this.content.indexOf("---", 3);
      let str = this.content.substring(0, i);
      if (i == -1) {
        return this.meta;
      }
      return JSON.parse(this.Yml2Json(str));
    },
    open() {
      this.meta = this.getMetaJson();
      this.drawer = true;
    },
    openParameter() {
      this.drawer_git = true;
    },
    getPostList() {
      getPosts().then((res) => {
        this.blogList = res.reverse();
      });
    },
  },
  created() {
    if (
      this.git_token != null &&
      this.git_username != null &&
      this.git_repo != null &&
      this.git_path != null
    ) {
      this.getPostList();
    } else {
      this.$message({
        message: "请先点击github参数设置，设置token,用户名等信息",
        type: "warning",
      });
    }
  },
};
</script>

<style>
.v-note-wrapper.shadow {
  height: 800px;
}
</style>
