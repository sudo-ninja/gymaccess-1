package com.jenixindia.qrunlock;

 import android.os.Bundle;
 import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;


import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
     @Override
     public void onCreate(Bundle savedInstanceState){
       super.onCreate(savedInstanceState);
       this.registerPlugin(GoogleAuth.class);
//          
     }

}


