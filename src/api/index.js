import { get,post,put ,deletePost} from "./http";

const git_username=localStorage.getItem("git_username")
const git_repo=localStorage.getItem("git_repo")
const  git_path=localStorage.getItem("git_path")

export const getPosts = () => get("/repos/"+git_username+"/"+git_repo+"/contents/"+git_path+"/");
export const getContent=(url) =>get(url)
export const updatePost=(urlhou,data) =>put("/repos/"+git_username+"/"+git_repo+"/contents/"+urlhou,data)
export const delPost=(urlhou,data) =>deletePost("/repos/"+git_username+"/"+git_repo+"/contents/"+urlhou,data)


//此处如果有参数传入给后端就需要写上参数 params/data 否则可以为空