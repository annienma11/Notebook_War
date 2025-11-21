using UnityEngine;

namespace NotebookWar.Weapons
{
    public class Rifle : WeaponBase
    {
        [Header("Rifle Specific")]
        [SerializeField] private bool hasADS = true;
        [SerializeField] private float adsZoomFactor = 1.5f;
        [SerializeField] private float adsTransitionSpeed = 8f;
        
        private bool isAiming = false;
        private Camera playerCamera;
        private float originalFOV;

        protected override void Awake()
        {
            base.Awake();
            playerCamera = Camera.main;
            if (playerCamera != null)
                originalFOV = playerCamera.fieldOfView;
        }

        protected override void Update()
        {
            HandleADS();
            base.Update();
        }

        private void HandleADS()
        {
            if (!hasADS || playerCamera == null) return;

            bool adsInput = input.GetAimInput();
            
            if (adsInput && !isAiming)
            {
                isAiming = true;
            }
            else if (!adsInput && isAiming)
            {
                isAiming = false;
            }

            // Smooth FOV transition for ADS
            float targetFOV = isAiming ? originalFOV / adsZoomFactor : originalFOV;
            playerCamera.fieldOfView = Mathf.Lerp(
                playerCamera.fieldOfView, 
                targetFOV, 
                adsTransitionSpeed * Time.deltaTime
            );
        }

        protected override void Fire()
        {
            // Rifle has better accuracy when aiming
            if (isAiming)
            {
                // Perfect accuracy when ADS
                base.Fire();
            }
            else
            {
                // Slight spread when hip firing
                ApplyHipFireSpread();
                base.Fire();
            }
        }

        private void ApplyHipFireSpread()
        {
            Vector3 spread = new Vector3(
                Random.Range(-weaponData.recoil, weaponData.recoil),
                Random.Range(-weaponData.recoil, weaponData.recoil),
                0
            );
            
            firePoint.localRotation = Quaternion.Euler(spread * 0.5f);
            
            // Reset after a short delay
            Invoke(nameof(ResetSpread), 0.1f);
        }

        private void ResetSpread()
        {
            firePoint.localRotation = Quaternion.identity;
        }

        public bool IsAiming() => isAiming;
    }
}