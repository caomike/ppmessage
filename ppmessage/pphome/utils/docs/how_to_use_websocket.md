# Android SDK

**PPMessage**提供了丰富的SDK供开发者选择和使用，Android SDK主要针对**PPMessage**的注册用户的Android应用系统集成**PPMessage**系统用户端界面的接口。

## 集成与使用

### 需求

- 下载 **PPMessage** Android SDK 和 Android SDK Demo。
- 确认使用 Eclipse 来开发 Android 应用。
- Google Android SDK API 9，Android 2.3 以上。

### 第一步

将下载好的 PPCom_Android_SDK 开发包进行解压，之后将其导入("File"-"Import"-"Android"-"Existing Android Code Into Workspace")到 eclipse 中，然后使你的项目引用它。

### 第二步

编辑AndroidManifest.xml文件，添加权限。
打开你的项目的 AndroidManifest.xml 文件，对照着SDK目录下面的 AndroidManifest.xml ，将下面的这段代码添加进你的 AndroidManifest.xml 文件中去。

#### 添加权限

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

### 第三步

开发包包含两个基本View组件：

1. PPLaunchView
2. PPComView

#### PPLauncherView

`PPLauncherView`是一个小的美观的按钮，可以让用户通过点击这个小按钮进入到反馈界面中去。你可以通过xml配置或者代码使用它，也可以编写你自己的View来替换它。

##### 通过xml配置使用`PPLauncherView`

    <com.yvertical.ppcomlib.view.PPLauncherView
        android:id="@+id/launcherView"
        android:layout_width="wrap_content"
	    android:layout_height="wrap_content"
    </com.yvertical.ppcomlib.view.PPLauncherView>

##### 通过代码使用`PPLauncherView`

    PPLauncherView mLauncherView = new PPLauncherView(getContext());

##### 设置监听事件

    PPLauncherView mLauncherView = new PPLauncherView(getContext());
    //PPLauncherView mLauncherView = findViewById(R.id.launcherView);

    mLauncherView.setOnClickListener(new View.OnClickListener(){
	    @Override
        public void onClick(View v) {
		   //open feedback activity
	    }
    });

#### `PPComView`

`PPComView`是核心聊天界面的View，用户可以在这个View中创建会话、对客服进行反馈会话等。可以通过xml配置或者代码来使用它。

##### 通过xml配置使用`PPComView`

    <com.yvertical.ppcomlib.view.PPComView
	    android:id="@+id/ppcomView"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
    </com.yvertical.ppcomlib.view.PPComView>

##### 通过代码使用`PPComView`

    PPComView mComView = new PPComView(getContext());

##### 初始化`PPComView`

    PPComView mComView = new PPComView(getContext());
    //PPComView mComView = findViewById(R.id.ppcomView);

    // 通过 PPComView.PPComConfig 来配置 PPComView 一些基本信息
    ppComView.init(
        getFragmentManager(),
        new PPComView.PPComConfig(
            "你的AppKey",
            "你的AppSecret")
            .setEnterKeyToSendMessage(true) //软键盘的 Enter 键是否可以发送消息
            .setUserEmail("somebody.web@yvertical.com") //用户邮箱，不填为匿名用户
    );

##### 遵循`Activity`生命周期

如果`PPComView`是放在`Activity`中的，那么需要遵循`Activity`的生命周期，否则会出现异常。如下所示：

`FeedBackActivity.java`源码：

    public class FeedBackActivity extends AppCompatActivity {

        private PPComView ppComView;

        @SuppressLint("NewApi")
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            ppComView = new PPComView(this);
            setContentView(ppComView);

            ppComView.init(
                    getFragmentManager(),
                    new PPComView.PPComConfig(Constants.PPCOM_APP_KEY,
                            Constants.PPCOM_APP_SECRET).setEnterKeyToSendMessage(
                            true).setUserEmail("somebody.web@yvertical.com"));
        }

        @Override
        protected void onActivityResult(int requestCode, int resultCode, Intent data) {
            if (ppComView != null
                    && !ppComView.onActivityResult(requestCode, resultCode, data)) {
                super.onActivityResult(requestCode, resultCode, data);
            }
        }

        @Override
        public void onBackPressed() {
            if (ppComView != null && !ppComView.onBackPressed()) {
                super.onBackPressed();
            }
        }

        @Override
        protected void onSaveInstanceState(Bundle outState) {
            super.onSaveInstanceState(outState);
            if (ppComView != null) {
                ppComView.onSaveInstanceState(outState);
            }
        }

        @Override
        protected void onRestoreInstanceState(Bundle savedInstanceState) {
            super.onRestoreInstanceState(savedInstanceState);
            if (ppComView != null) {
                ppComView.onRestoreInstanceState(savedInstanceState);
            }
        }

        @Override
        protected void onPause() {
            super.onPause();
            if (ppComView != null) {
                ppComView.onPause();
            }
        }

        @Override
        protected void onResume() {
            super.onResume();
            if (ppComView != null) {
                ppComView.onResume();
            }
        }

        @Override
        protected void onStop() {
            super.onStop();
            if (ppComView != null) {
                ppComView.onStop();
            }
        }

        @Override
        protected void onDestroy() {
            super.onDestroy();
            if (ppComView != null) {
                ppComView.onDestroy();
            }
        }

    }

##### 遵循`Fragtment`生命周期

如果`PPComView`是放在`Fragment`中的，那么需要遵循`Fragment`的生命周期，否则会出现异常。如下所示：

`FeedBackFragment.java`源码：
    
    public class FeedBackFragment extends Fragment {

        private static final String TAG = FeedBackFragment.class.getSimpleName();

        private PPComView ppComView;

        public FeedBackFragment() {

        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                Bundle savedInstanceState) {
            android.util.Log.d(TAG, "onCreateView");
            ppComView = (PPComView) inflater.inflate(R.layout.ppcom, container,
                    false);
            ppComView.init(
                    getFragmentManager(),
                    new PPComView.PPComConfig(Constants.PPCOM_APP_KEY,
                            Constants.PPCOM_APP_SECRET).setEnterKeyToSendMessage(
                            true).setUserEmail("somebody.web@yvertical.com"));
            return ppComView;
        }

        @Override
        public void onActivityCreated(Bundle savedInstanceState) {
            super.onActivityCreated(savedInstanceState);
            if (savedInstanceState != null) {
                if (ppComView != null) {
                    ppComView.onRestoreInstanceState(savedInstanceState);
                }
            }
        }

        @Override
        public void onSaveInstanceState(Bundle outState) {
            super.onSaveInstanceState(outState);
            if (ppComView != null) {
                ppComView.onSaveInstanceState(outState);
            }
        }

        @Override
        public void onDestroy() {
            super.onDestroy();
            if (ppComView != null) {
                ppComView.onDestroy();
            }
        }

        @Override
        public void onPause() {
            super.onPause();
            if (ppComView != null) {
                ppComView.onPause();
            }
        }

        @Override
        public void onResume() {
            super.onResume();
            if (ppComView != null) {
                ppComView.onResume();
            }
        }

        @Override
        public void onStop() {
            super.onStop();
            if (ppComView != null) {
                ppComView.onStop();
            }
        }

        public boolean handledActivityResult(int requestCode, int resultCode,
                Intent data) {
            if (ppComView != null) {
                return ppComView.onActivityResult(requestCode, resultCode, data);
            }
            return false;
        }

        public boolean onBackPressed() {
            if (ppComView != null) {
                return ppComView.onBackPressed();
            }
            return false;
        }
    }

当在`Fragment`中使用的时候，`Fragment`所在的`Activity`应该处理`onBackPressed`和`onActivityResult`事件，如下所示：

    public class FeedBackFragmentActivity extends AppCompatActivity {

        private FeedBackFragment mFeedBackFragment;
        
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_feedback_fragment);
            
            mFeedBackFragment = (FeedBackFragment) getSupportFragmentManager()
                    .findFragmentById(R.id.mFeedbackFrag);
        }

        @Override
        protected void onActivityResult(int requestCode, int resultCode, Intent data) {
            if (!mFeedBackFragment.handledActivityResult(requestCode, resultCode,
                    data)) {
                super.onActivityResult(requestCode, resultCode, data);
            }
        }

        @Override
        public void onBackPressed() {
            if (!mFeedBackFragment.onBackPressed()) {
                super.onBackPressed();
            }
        }
    }
