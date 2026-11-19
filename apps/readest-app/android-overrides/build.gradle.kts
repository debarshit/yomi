import java.util.Properties
import java.io.FileInputStream
import org.apache.tools.ant.taskdefs.condition.Os

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("rust")
}

val tauriProperties = Properties().apply {
    val propFile = file("tauri.properties")
    if (propFile.exists()) {
        propFile.inputStream().use { load(it) }
    }
}

android {
    compileSdk = 36
    namespace = "com.biblophile.yomi"
    if (project.findProperty("penFlavor") == "booxPen") {
        packaging.jniLibs.pickFirsts.add("lib/*/libc++_shared.so")
    }
    val keystorePropertiesFile = rootProject.file("keystore.properties")
    val keystoreProperties = Properties()
    if (keystorePropertiesFile.exists()) {
        keystoreProperties.load(FileInputStream(keystorePropertiesFile))
    }
    defaultConfig {
        manifestPlaceholders["usesCleartextTraffic"] = "true"
        manifestPlaceholders["sentryDsn"] = System.getenv("SENTRY_DSN")?.takeIf { it.isNotBlank() }
            ?: listOf("../../../.env.local", "../../../.env")
                .map { rootProject.file(it) }
                .filter { it.exists() }
                .firstNotNullOfOrNull { f ->
                    f.readLines()
                        .map { it.trim() }
                        .firstOrNull { it.startsWith("SENTRY_DSN=") }
                        ?.substringAfter("=")?.trim()?.trim('"', '\'')?.takeIf { it.isNotEmpty() }
                }
            ?: ""
        applicationId = "com.biblophile.yomi"
        minSdk = 26
        targetSdk = 36
        versionCode = tauriProperties.getProperty("tauri.android.versionCode", "1").toInt()
        versionName = tauriProperties.getProperty("tauri.android.versionName", "1.0")
        val storeFlavor = project.findProperty("storeFlavor")?.toString() ?: "foss"
        missingDimensionStrategy("store", storeFlavor)
        val penFlavor = project.findProperty("penFlavor")?.toString() ?: "genericPen"
        missingDimensionStrategy("pen", penFlavor)
        manifestPlaceholders["carAppMetaName"] = if (storeFlavor == "googleplay") {
            "com.biblophile.yomi.androidauto.withheld"
        } else {
            "com.google.android.gms.car.application"
        }
    }
    signingConfigs {
        if (keystorePropertiesFile.exists()) {
            create("signing") {
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["password"] as String
                storeFile = file(keystoreProperties["storeFile"] as String)
                storePassword = keystoreProperties["password"] as String
            }
        }
        create("release") {
            if (keystorePropertiesFile.exists()) {
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
                val sf = keystoreProperties.getProperty("storeFile")
                if (sf != null) {
                    storeFile = file(sf)
                }
                storePassword = keystoreProperties.getProperty("password")
            }
        }
    }
    buildTypes {
        getByName("debug") {
            manifestPlaceholders["usesCleartextTraffic"] = "true"
            isDebuggable = true
            isJniDebuggable = true
            isMinifyEnabled = false
            if (keystorePropertiesFile.exists()) {
                signingConfig = signingConfigs.getByName("signing")
            }
            packaging {
                jniLibs.keepDebugSymbols.add("*/arm64-v8a/*.so")
                jniLibs.keepDebugSymbols.add("*/armeabi-v7a/*.so")
                jniLibs.keepDebugSymbols.add("*/x86/*.so")
                jniLibs.keepDebugSymbols.add("*/x86_64/*.so")
            }
        }
        getByName("release") {
            isMinifyEnabled = true
            if (keystorePropertiesFile.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
            proguardFiles(
                *fileTree(".") { include("**/*.pro") }
                    .plus(getDefaultProguardFile("proguard-android-optimize.txt"))
                    .toList().toTypedArray()
            )
        }
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        buildConfig = true
    }
}

rust {
    rootDirRel = "../../../"
}

val llvmStripExecutable = if (Os.isFamily(Os.FAMILY_WINDOWS)) "llvm-strip.exe" else "llvm-strip"

fun findLlvmStrip(): File? {
    val ndkRoots = listOfNotNull(
        System.getenv("NDK_HOME"),
        System.getenv("ANDROID_NDK_HOME"),
        System.getenv("ANDROID_NDK_ROOT"),
    ).map { File(it) } +
        (File(android.sdkDirectory, "ndk").listFiles().orEmpty().sortedDescending())
    return ndkRoots
        .flatMap { File(it, "toolchains/llvm/prebuilt").listFiles().orEmpty().toList() }
        .map { File(it, "bin/$llvmStripExecutable") }
        .firstOrNull { it.isFile }
}

val prestrippedLibs =
    if (project.findProperty("penFlavor") == "booxPen") listOf("libneo_pen.so", "libc++.so") else emptyList()

tasks.configureEach {
    if (!name.startsWith("strip") || !name.endsWith("ReleaseDebugSymbols")) return@configureEach
    doLast {
        val llvmStrip = findLlvmStrip() ?: return@doLast
        val libs = outputs.files.asFileTree.matching {
            include("**/*.so")
            prestrippedLibs.forEach { exclude("**/$it") }
        }
        libs.forEach { lib ->
            providers.exec {
                commandLine(llvmStrip.absolutePath, "--strip-all", lib.absolutePath)
            }.result.get().assertNormalExitValue()
        }
    }
}

if (project.findProperty("penFlavor") == "booxPen") {
    repositories {
        maven { url = uri("https://repo.boox.com/repository/maven-public/") }
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.14.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("androidx.activity:activity-ktx:1.10.1")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.lifecycle:lifecycle-process:2.10.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.4")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.0")
}

apply(from = "tauri.build.gradle.kts")
