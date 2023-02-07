<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payinfo.totalFee }}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>熊猫商城商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>

      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <el-button class="btn" type="text" @click="open">立即支付</el-button>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//引入qrcode支付
import QRCode from 'qrcode'
import {reqPaystate} from "@/api";

export default {
  name: 'Pay',
  data() {
    return {
      //总金额
      payinfo: {},
      timer: null,
      //支付状态码
      code: ''
    }
  },
  computed: {
    //计算编号 计算属性一定要有return
    orderId() {
      return this.$route.query.orderId
    }
  },
  //工作中尽量别再生命周期函数中写异步 可以写方法中 生命周期调用
  mounted() {
    this.getPayinfo()
  },
  methods: {
    //支付信息
    async getPayinfo() {
      let result = await this.$API.reqOrderPay(this.orderId)
      if (result.code === 200) {
        this.payinfo = result.data
      }
    },
    //ui弹窗
    async open() {
      //生成二维码
      let url = await QRCode.toDataURL('wxp://f2f0YUwn8J6QxThTm61K037p4ddNSW0EvQiKcy0jrthKSiA');

      this.$alert(`<img src=${url} />`, '请您微信支付', {
        dangerouslyUseHTMLString: true,
        center: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '支付出现问题',
        confirmButtonText: '支付完成',
        //MessageBox 关闭前的回调，
        beforeClose:(action, instance, done) =>{
          //点击了有问题
          if (action == 'cancel') {
            //关闭定时器
            clearInterval(this.timer)
            this.timer=null
            //弹出提示信息
            alert('请扫描下方二维码交流')
            //关闭弹窗
            done()
          }else {
           // if (this.code==200){
              //关闭定时器
              clearInterval(this.timer)
            this.timer=null
              done()
              this.$router.push('/paysuccess')
           // }
          }
        }
      });
      //你需要知道成功失败
      //支付成功路由跳转，支付失败弹出信息
      //没有定时器就开一个
      if (!this.timer) {
        //开启定时器1秒查询一次用户支付状态
        this.timer = setInterval(async () => {
          let result = await this.$API.reqPaystate(this.orderId)
          //z支付成功code==200
          if (result.code == 200) {
            //关闭定时器
            clearInterval(this.timer)
            this.timer = null
            //保存支付成功的code
            this.code = result.code
            //关闭弹窗
            this.$msgbox.close()
            //跳转路由
            this.$router.push('/paysuccess')
          }
        }, 1000)

      }
    },
  },
}
</script>

<style lang="less" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;

        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            line-height: 18px;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
</style>