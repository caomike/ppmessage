# iOS SDK

**PPMessage**提供了丰富的SDK供开发者选择和使用，iOS SDK主要针对**PPMessage**的注册用户的iOS应用系统集成**PPMessage**系统用户端界面的接口。

## 在项目中集成 `PPComLib`

下面以 `PPComDemo` 演示如何导入 `PPComLib` 进行集成

### 步骤一
将下载到的`PPComLib.zip`进行解压，假设解压之后放到了桌面上，接着直接拖动`PPComLib`整个文件夹到你的`Project`中去。如图所示：

![Drag-PPComLib-To-Your-Project](/static/ppmessage/img/doc/integrate-ppcomlib-1.png)

### 步骤二
松开鼠标之后，XCode将会提示你设置一些拷贝信息，这个时候记得勾选上 `Copy items if needed` 前面的对号。如图所示：

![Check-Copy-Items-If-Needed](/static/ppmessage/img/doc/integrate-ppcomlib-2.png)

### 步骤三
选择 "TARGETS" 下面的 "PPComDemo"，切换到 "General"面板。如图所示：

![add-libicucore-lib-1](/static/ppmessage/img/doc/integrate-ppcomlib-3.png)

### 步骤四
添加动态链接库 `libicucore.dylib` 或者 `libicucore.tbd` 到你的 Project 中去。在 General 面板中，点击最下面的 "+" 号，在弹出的对话框中搜索 "libicucore.dylib" 或者 "libicucore.tbd" ，然后点击 "Add" 按钮添加至你的项目中去。

![add-libicucore-lib-2](/static/ppmessage/img/doc/integrate-ppcomlib-4.png)

### 步骤五
修改项目编译参数。根据下图提示的 1、2、3、4 步骤，找到 `Other Linker Flags` 选项，然后双击进行修改，添加上 `-ObjC -all_load` 参数。至此，就可以在项目中使用 `PPComLib` 了。

![add-libicucore-lib-2](/static/ppmessage/img/doc/integrate-ppcomlib-5.png)

## 在项目中使用 `PPComLib`

引入头文件

    #import <PPComLib/PPComLib.h>

创建一个你自己的`UIViewController`使其继承自`PPMessagesViewController`。在你刚创建的`UIViewController`的实现文件中，在`viewDidLoad`方法中配置初始化参数`appKey`和`appSecret`。

    - (void)viewDidLoad {
          [super viewDidLoad];

          // set your appKey
          self.appKey = APP_KEY;
          // set your appSecret
          self.appSecret = APP_SECRET;

          // initialize with user_email or call `[self initialize]` to initialize with anonymous user.
          [self initializeWithUserEmail:USER_EMAIL];

          // set title
          self.title = @"Feedback";
          // set input view place holder
          [self setInputViewPlaceHolder:@"请输入..."];
      }