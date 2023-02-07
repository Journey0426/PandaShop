<template>
  <div class="register-container">
    <div class="register">
      <h3>注册新用户
        <span class="go">我有账号，去 <router-link to="/login" target="_self">登陆</router-link>
        </span>
      </h3>
      <el-form  :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="content">
        <el-form-item  prop="phone" >
          <label>手机号:</label>
          <el-input type="text" v-model="ruleForm.phone" placeholder="请输入你的手机号" autocomplete="off"></el-input>
        </el-form-item>
      </div>
        <div class="content">
        <el-form-item  prop="code" >
          <label>验证码:</label>
          <el-input type="text" v-model="ruleForm.code" placeholder="请输入你验证码" autocomplete="off"></el-input>
          &nbsp;
          <button style="height: 38px;width: 100px" @click="getCode(ruleForm.phone)">获取验证码</button>
        </el-form-item>
        </div>
        <div class="content">
        <el-form-item  prop="password" >
          <label>登录密码:</label>
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入你的登录密码" autocomplete="off" class="el-input2"></el-input>
        </el-form-item>
        </div>
        <div class="content">
        <el-form-item  prop="repassword" >
          <label>确认密码:</label>
          <el-input type="password" v-model="ruleForm.repassword" placeholder="请确认你的登录密码" autocomplete="off" class="el-input2"></el-input>
        </el-form-item>
        </div>
      </el-form>
      <div class="controls">
        <input name="m1" type="checkbox" :checked="ruleForm.agree" @change="changeagree(ruleForm.agree)">
        <span>同意协议并注册《熊猫商城用户协议》</span>
      </div>
      <div class="btn">
        <button @click="register">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机熊猫商城</li>
        <li>销售联盟</li>
        <li>熊猫商城社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      //手机表单规则
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (!this.ruleForm.pattern.test(value)) {
              callback(new Error('请输入正确的手机号码格式'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      //密码表单规则
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.repassword !== '') {
            this.$refs.ruleForm.validateField('repassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm:{
          phone: '',
          code: '',
          password: '',
          repassword: '',
          agree: false,
          pattern:/^1[3|5|7|8|9]\d{9}$/,
        },
        //表单验证规则
        rules: {
          password: [
            { validator: validatePass, trigger: ['blur',  'change'] }
          ],
          repassword: [
            { validator: validatePass2, trigger: ['blur',  'change']}
          ],
          phone: [
            { validator: checkPhone, trigger: ['blur','change' ] }
          ]
        }
      }
    },
    methods:{
      //获取验证码
      async getCode(phone){
        try {
          await  this.$store.dispatch('user/getcode',phone)
          //让data里的code为仓库中的code
         this.ruleForm.code=this.$store.state.user.code
        }catch (err){
          alert('请先输入手机号')
        }
      },
      //完成注册按钮
      //async register(phone,password,code,repassword){
      async register(){
       const {phone,password,repassword,agree,code} =this.ruleForm
        try {
         let bool=  password===repassword&&phone&&agree&&code&&password
          if (bool){
            await this.$store.dispatch('user/getregister',{phone,code,password})
          await this.$router.push('/login')
          }
        }catch (err){
          alert('faile')
        }
      },
      //改变agree的值
      changeagree(agree){
        this.ruleForm.agree=!agree

      }
    }
  }
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      position: relative;
      margin-bottom: -50px;
      bottom: 50px;
      label{
        font-size: 16px;
        color: #409eff;
        margin-right: 20px;
      }
      //修改提示错误信息位置 深度修改
      ::v-deep .el-form-item__error {
        left: 80px;
      }
    .el-input {
        height: 38px;
      width: 260px;
        margin-left: 5px;
        outline: none;

      }
      .el-input2{
        height: 38px;
        width: 260px;
        right: 15px;
        outline: none;
      }
      }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }


    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }


}
</style>